# kubernetes-activity-scaler
**Problem**: You have game servers running on a shared Kubernetes cluster. They take up a significant amount of resources when running and you currently run them 24/7 even when players are only connected for a few hours each day.

**Solution**: By placing a network traffic proxy in-front of the server, we can monitor when connections are happening. This proxy can `scale` up workload controllers when there are active users and `scale` them back down when they all disconnect.

## Usage
1. Deploy the activity-scaler into your workload's namespace.
2. ????
3. PROFIT!

## References
- https://nginx.org/en/docs/stream/stream_processing.html
- https://nginx.org/en/docs/stream/ngx_stream_js_module.html
- https://github.com/nginx/njs-examples
