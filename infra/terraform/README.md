# Terraform layer

This configuration targets Yandex Cloud Managed Kubernetes because the repository does not contain an MWS Terraform provider. For another cloud, keep the outputs and replace `main.tf` with that provider's network and managed-cluster resources; the Kubernetes layer is provider-independent.

The cloud service accounts referenced by `service_account_id` and `node_service_account_id` must already exist and have the permissions required by Yandex Managed Service for Kubernetes. Credentials should be supplied through the provider's supported environment variables, never committed to `terraform.tfvars`.
