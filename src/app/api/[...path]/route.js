import { ROOT_URL } from '@/utils/rootUrl';
import { cookies } from 'next/headers';

async function buildTargetUrl(req, paramsPromise) {
  const params = await paramsPromise;

  const base = ROOT_URL.replace(/\/+$/, '');
  const path = Array.isArray(params?.path)
    ? params.path.join('/')
    : params?.path || '';
  const incomingUrl = new URL(req.url);
  const search = incomingUrl.search || '';
  return `${base}/${path}${search}`;
}

async function buildBackendHeaders() {
  const safeHeaders = {
    'content-type': 'application/json',
    Accept: 'application/json',
    'API-check':
      '0xE156CCD73FB1D403758CC8A41D1BDD082F7B566AAA7C4FB58ED7EB19299126B5',
  };

  const cookieStore = await cookies();
  const authCookie = cookieStore.get('token')?.value;

  if (authCookie) {
    safeHeaders.authorization = `Bearer ${authCookie}`;
  }

  return safeHeaders;
}

async function forwardRequest(req, paramsPromise) {
  const targetUrl = await buildTargetUrl(req, paramsPromise);
  const method = req.method;
  const backendHeaders = await buildBackendHeaders();

  let body;
  if (method !== 'GET' && method !== 'HEAD') {
    body = await req.arrayBuffer();
  }

  const backendResp = await fetch(targetUrl, {
    method,
    headers: backendHeaders,
    body: body && body.byteLength ? body : undefined,
  });

  const headers = {};
  backendResp.headers.forEach((value, key) => {
    if (!['transfer-encoding', 'connection'].includes(key.toLowerCase())) {
      headers[key] = value;
    }
  });

  const buffer = await backendResp.arrayBuffer();
  return new Response(buffer, {
    status: backendResp.status,
    headers,
  });
}

export async function GET(req, context) {
  return forwardRequest(req, context.params);
}
export async function POST(req, context) {
  return forwardRequest(req, context.params);
}
export async function PUT(req, context) {
  return forwardRequest(req, context.params);
}
export async function PATCH(req, context) {
  return forwardRequest(req, context.params);
}
export async function DELETE(req, context) {
  return forwardRequest(req, context.params);
}
export async function OPTIONS(req, context) {
  return forwardRequest(req, context.params);
}
