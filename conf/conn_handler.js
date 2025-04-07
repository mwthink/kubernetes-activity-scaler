import Fs from 'fs';

/**
 * Wrapper around ngx.fetch() which connects to the Kubernetes API
 */
async function kubefetch(apiPath,options){
  const authToken = Fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/token', 'utf-8');
  const finalOptions = Object.assign({},options,{
    verify: process.env['ENABLE_TLS_VERIFICATION'].trim().toLowerCase() !== 'false',
    headers: Object.assign({}, {
      'Authorization': `Bearer ${authToken}`,
    }, (options.headers || {})),
    body: JSON.stringify(options.body || {})
  })
  return ngx.fetch(`https://${process.env['KUBERNETES_SERVICE_HOST']}:${process.env['KUBERNETES_SERVICE_PORT']}${apiPath}`, finalOptions);
}

/**
 * This function is called during the Stream's Access phase
 * It allows the request to proceed when the target Service is Ready
 */
async function on_access(s){
  // check if Service is Ready
  const workloadApiPath = `/apis/apps/v1/namespaces/default/${process.env['WORKLOAD_TYPE']}s/${process.env['WORKLOAD_NAME']}`;
  const resp = await kubefetch(workloadApiPath, {});
  const workloadManifest = await resp.json();
  const currentReplicas = workloadManifest.spec.replicas;

  // Check if there is an existing replica
  if(currentReplicas > 0){
    // If there is, allow the request through
    return s.done();
  }
  else {
    // If there is no existing replica, scale it up to 1
    s.error('Scaling up workload...');
    const resp = await kubefetch(`${workloadApiPath}/scale`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/merge-patch+json'
      },
      body: {
        spec: {replicas:1}
      }
    })
    if(resp.status !== 200){
      s.error('Error during scale operation.');
      s.error(resp);
      s.error(resp.json());
    }
    else {
      s.error('Workload scaled.')
      s.done();
    }
  }
}

export default {on_access};


