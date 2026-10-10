# Kubernetes layer

Apply the numbered manifests after installing an Nginx Ingress controller and Chaos Mesh. The backend and frontend image names are placeholders; replace them before applying in a remote cluster, or build them into the local Minikube image cache.

`kustomization.yaml` is provided for inspection and namespace defaults. Because Kubernetes does not expand `${...}` in plain YAML, use the deployment commands in `infra/DEPLOY.md` to render image names with `envsubst` before `kubectl apply`.
