import { NextResponse } from 'next/server';
import { HttpsProxyAgent } from 'https-proxy-agent';

// Feishu Credentials
const APP_ID = 'cli_a874904b1439900b';
const APP_SECRET = 'zaHfS0mRaYHN2PC6IYiQRQnPY84L0naB';
const APP_TOKEN = 'Yk3RbKKzVajoH9skPPOclMaJnt9'; // Bitable Token
const TABLE_ID = 'tblg9NRQNmiqyfSR';

// Proxy Configuration
// Try to get from env, otherwise default to common local proxy ports if needed
// You can change this to your actual proxy address, e.g., 'http://127.0.0.1:7890'
const PROXY_URL = process.env.HTTP_PROXY || 'http://127.0.0.1:7890';
const agent = PROXY_URL ? new HttpsProxyAgent(PROXY_URL) : undefined;

// Helper to add timeout and proxy to fetch
async function fetchWithTimeout(resource: string, options: RequestInit & { timeout?: number } = {}) {
    const { timeout = 15000 } = options; // Default 15s timeout

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const fetchOptions: any = {
            ...options,
            signal: controller.signal,
        };

        // Add agent if proxy is configured
        if (agent) {
            fetchOptions.agent = agent;
            // console.log(`Using proxy: ${PROXY_URL}`); // Uncomment for debugging
        }

        const response = await fetch(resource, fetchOptions);
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

async function getTenantAccessToken() {
    console.log('Requesting Tenant Access Token...');
    try {
        const response = await fetchWithTimeout('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                app_id: APP_ID,
                app_secret: APP_SECRET,
            }),
            timeout: 20000 // 20s timeout
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.code !== 0 || !data.tenant_access_token) {
            throw new Error(`Failed to get tenant access token: ${data.msg || 'Unknown error'}`);
        }
        return data.tenant_access_token;
    } catch (error: any) {
        console.error('Get Token Error:', error);
        if (error.name === 'AbortError') {
            throw new Error('连接飞书服务器超时，请检查网络或代理设置 (Connection timed out)');
        }
        // Check for common proxy errors
        if (error.code === 'ECONNREFUSED') {
            throw new Error(`连接被拒绝，请检查代理设置是否正确 (Proxy: ${PROXY_URL})`);
        }
        throw new Error(`获取访问凭证失败: ${error.message}`);
    }
}

async function uploadFile(file: File, accessToken: string): Promise<string> {
    const formData = new FormData();
    formData.append('file_name', file.name);
    formData.append('parent_type', 'bitable_file');
    formData.append('parent_node', APP_TOKEN);
    formData.append('size', file.size.toString());
    formData.append('file', file);

    console.log(`Uploading file: ${file.name} (${file.size} bytes)`);

    try {
        const response = await fetchWithTimeout('https://open.feishu.cn/open-apis/drive/v1/medias/upload_all', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
            timeout: 60000 // 60s timeout for upload
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.code !== 0) {
            console.error('Feishu File Upload Error:', data);
            throw new Error(`Failed to upload file: ${data.msg}`);
        }

        return data.data.file_token;
    } catch (error: any) {
        console.error('Upload File Error:', error);
        if (error.name === 'AbortError') {
            throw new Error('文件上传超时，请检查网络 (Upload timed out)');
        }
        throw error;
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const nickname = formData.get('nickname') as string;
        const contact = formData.get('contact') as string;
        const idea = formData.get('idea') as string;

        // Get all files
        const files = formData.getAll('files') as File[];

        console.log('Processing submission...', {
            nickname,
            contact,
            idea,
            fileCount: files.length,
            files: files.map(f => ({ name: f.name, size: f.size }))
        });

        // 1. Get Access Token
        const accessToken = await getTenantAccessToken();
        console.log('Got access token');

        // 2. Upload files if exist
        const fileTokens: string[] = [];
        if (files.length > 0) {
            console.log(`Uploading ${files.length} file(s)...`);
            for (const file of files) {
                if (file.size > 0) {
                    try {
                        const token = await uploadFile(file, accessToken);
                        fileTokens.push(token);
                        console.log(`File uploaded: ${file.name}, token:`, token);
                    } catch (error: any) {
                        console.error(`Failed to upload file ${file.name}:`, error);
                        throw new Error(`文件上传失败: ${file.name} - ${error.message}`);
                    }
                }
            }
        }

        // 3. Create Record
        // IMPORTANT: These keys MUST match the column names in your Feishu Bitable exactly.
        const fields: any = {
            "Nickname": nickname,
            "Contact": contact,
            "Idea": idea,
        };

        if (fileTokens.length > 0) {
            fields["Attachment"] = fileTokens.map(token => ({ file_token: token }));
        }

        console.log('Creating record with fields:', fields);

        const response = await fetchWithTimeout(`https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fields: fields,
            }),
            timeout: 20000
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.code !== 0) {
            console.error('Feishu API Error:', data);
            throw new Error(`Failed to create record: ${data.msg}`);
        }

        console.log('Record created successfully:', data.data.record.record_id);

        return NextResponse.json({ success: true, message: 'Feedback received' });
    } catch (error: any) {
        console.error('Error processing feedback:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
