terraform {
  required_version = ">= 1.6.0"
  required_providers {
    yandex = {
      source  = "yandex-cloud/yandex"
      version = "~> 0.140"
    }
  }
}

provider "yandex" {
  cloud_id  = var.cloud_id
  folder_id = var.folder_id
  zone      = var.zone
}

resource "yandex_vpc_network" "main" {
  name = "${var.cluster_name}-network"
}

resource "yandex_vpc_subnet" "main" {
  name           = "${var.cluster_name}-subnet"
  zone           = var.zone
  network_id     = yandex_vpc_network.main.id
  v4_cidr_blocks = ["10.20.0.0/24"]
}

resource "yandex_kubernetes_cluster" "main" {
  name        = var.cluster_name
  description = "Wreck This Cluster demonstration platform"
  network_id  = yandex_vpc_network.main.id

  master {
    version   = "1.30"
    public_ip = true
    zonal {
      zone      = var.zone
      subnet_id = yandex_vpc_subnet.main.id
    }
  }

  service_account_id      = var.service_account_id
  node_service_account_id = var.node_service_account_id
  release_channel         = "REGULAR"

  depends_on = [yandex_vpc_subnet.main]
}

resource "yandex_kubernetes_node_group" "workers" {
  cluster_id = yandex_kubernetes_cluster.main.id
  name       = "${var.cluster_name}-workers"
  version    = "1.30"

  instance_template {
    platform_id = "standard-v3"
    resources {
      cores  = var.node_cores
      memory = var.node_memory_gb
    }
    boot_disk {
      type = "network-hdd"
      size = 30
    }
    network_interface {
      nat = true
      subnet_ids = [yandex_vpc_subnet.main.id]
    }
  }

  scale_policy {
    fixed_scale {
      size = var.node_count
    }
  }
}
