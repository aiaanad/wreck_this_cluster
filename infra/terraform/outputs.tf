output "cluster_id" {
  value = yandex_kubernetes_cluster.main.id
}

output "cluster_endpoint" {
  value     = yandex_kubernetes_cluster.main.master[0].external_v4_endpoint
  sensitive = true
}

output "network_id" {
  value = yandex_vpc_network.main.id
}

output "subnet_id" {
  value = yandex_vpc_subnet.main.id
}
