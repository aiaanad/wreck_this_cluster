variable "cloud_id" {
  type        = string
  description = "Yandex Cloud ID."
}

variable "folder_id" {
  type        = string
  description = "Yandex Cloud folder ID."
}

variable "zone" {
  type    = string
  default = "ru-central1-a"
}

variable "cluster_name" {
  type    = string
  default = "wreck-this-cluster"
}

variable "service_account_id" {
  type        = string
  description = "Service account allowed to manage the managed Kubernetes cluster."
}

variable "node_service_account_id" {
  type        = string
  description = "Service account used by worker nodes."
}

variable "node_count" {
  type    = number
  default = 3
}

variable "node_cores" {
  type    = number
  default = 2
}

variable "node_memory_gb" {
  type    = number
  default = 4
}
