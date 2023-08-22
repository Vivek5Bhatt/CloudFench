import { Box } from "@mui/system";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { FormControl, MenuItem, Select, Tab } from "@mui/material";
var linkDataArray = [
  {
    from: "vpc-prod (vpc-08021314689936822)",
    to: "prod-snet-pub (subnet-07adb4c97037b9770)",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-0e0637df4de0f6de4",
  },
  {
    from: "eni-0e0637df4de0f6de4",
    to: "elasticache (ElastiCache little-wallet-production-001 (ap-southeast-1b, 10.2.3.219))",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-046126102de9731ed",
  },
  {
    from: "eni-046126102de9731ed",
    to: "lb (ELB app/k8s-staging-lwwebapp-97d0c777bb/623fd4be4c6382c1 (ap-southeast-1b, 10.2.3.246))",
  },
  {
    from: "eni-046126102de9731ed",
    to: "applicationEndpoint (54.169.165.202)",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-0624fd6f1f2538913",
  },
  {
    from: "eni-0624fd6f1f2538913",
    to: "ELB net/a3e0a85cfb2de4ea68da79d1dc9cae48/ce09a1c6df3072e2",
  },
  {
    from: "eni-0624fd6f1f2538913",
    to: "applicationEndpoint (18.138.95.133)",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-0ac65295b00fb68b3",
  },
  {
    from: "eni-0ac65295b00fb68b3",
    to: "ec2 (ubuntu-productioneks-ubuntu-productioneks-ng-Node (ap-southeast-1b, 10.2.3.79))",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-0553638ff59accf19",
  },
  {
    from: "eni-0553638ff59accf19",
    to: "ec2 (ubuntu-productioneks-ubuntu-productioneks-ng-Node (ap-southeast-1b, 10.2.3.238))",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-0f2920878db097ede",
  },
  {
    from: "eni-0f2920878db097ede",
    to: "lb (ELB app/k8s-default-apiwebli-58af1eb88e/783ea82461ccdd48 (ap-southeast-1b, 10.2.3.136))",
  },
  {
    from: "eni-0f2920878db097ede",
    to: "applicationEndpoint (54.169.214.136)",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-0c8e3eecfdc9b856b",
  },
  {
    from: "eni-0c8e3eecfdc9b856b",
    to: "lb (ELB app/k8s-prod-skooliee-6469a7b209/1d5d684b11c5ca4b (ap-southeast-1b, 10.2.3.208))",
  },
  {
    from: "eni-0c8e3eecfdc9b856b",
    to: "applicationEndpoint (52.76.102.77)",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-01c2c7e03733defdd",
  },
  {
    from: "eni-01c2c7e03733defdd",
    to: "ec2 (ubuntu-productioneks-ubuntu-productioneks-ng-Node (ap-southeast-1b, 10.2.3.73))",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-0c3e9cab840063548",
  },
  {
    from: "eni-0c3e9cab840063548",
    to: "lb (ELB app/k8s-prod-lwmainap-e8103f1037/d3873c9bbee29c3b (ap-southeast-1b, 10.2.3.150))",
  },
  {
    from: "eni-0c3e9cab840063548",
    to: "applicationEndpoint (54.151.143.110)",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-086ec4160de0493ac",
  },
  {
    from: "eni-086ec4160de0493ac",
    to: "ec2 (ubuntu-productioneks-ubuntu-productioneks-ng-Node (ap-southeast-1b, 10.2.3.252))",
  },
  {
    from: "eni-086ec4160de0493ac",
    to: "applicationEndpoint (13.212.233.197)",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-029f248b0a8d0446d",
  },
  {
    from: "eni-029f248b0a8d0446d",
    to: "lb (ELB app/k8s-staging-lwwebapp-a5ad99036a/8570af602303e242 (ap-southeast-1b, 10.2.3.103))",
  },
  {
    from: "eni-029f248b0a8d0446d",
    to: "applicationEndpoint (54.179.0.247)",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-028ea9803b081f046",
  },
  {
    from: "eni-028ea9803b081f046",
    to: "lb (ELB app/k8s-prod-lwwebapp-da43153f0a/2f924555b84df3a9 (ap-southeast-1b, 10.2.3.85))",
  },
  {
    from: "eni-028ea9803b081f046",
    to: "applicationEndpoint (54.179.123.163)",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-072354698df571670",
  },
  {
    from: "eni-072354698df571670",
    to: "lb (ELB app/k8s-staging-lwwebbac-05513e9cac/eded40bf05b970d0 (ap-southeast-1b, 10.2.3.80))",
  },
  {
    from: "eni-072354698df571670",
    to: "applicationEndpoint (13.214.100.14)",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-05e2205e3a5203d0e",
  },
  {
    from: "eni-05e2205e3a5203d0e",
    to: "lb (ELB app/k8s-prod-skooliee-a4867050b5/73b7b6624f2159a9 (ap-southeast-1b, 10.2.3.164))",
  },
  {
    from: "eni-05e2205e3a5203d0e",
    to: "applicationEndpoint (54.255.9.102)",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-01cb7914a3c2e0677",
  },
  {
    from: "eni-01cb7914a3c2e0677",
    to: "lb (ELB app/k8s-prod-lwwebbac-aa101cb779/a77364603178de9d (ap-southeast-1b, 10.2.3.121))",
  },
  {
    from: "eni-01cb7914a3c2e0677",
    to: "applicationEndpoint (13.213.225.33)",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-08ac049b24c00929f",
  },
  {
    from: "eni-08ac049b24c00929f",
    to: "lb (ELB aec646050e2964c3cbaf1e0c2f3a918f (ap-southeast-1b, 10.2.3.40))",
  },
  {
    from: "eni-08ac049b24c00929f",
    to: "applicationEndpoint (18.139.154.151)",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-0251ac7de85dc0060",
  },
  {
    from: "eni-0251ac7de85dc0060",
    to: "ec2 (ubuntu-productioneks-ubuntu-productioneks-ng-Node (ap-southeast-1b, 10.2.3.244))",
  },
  {
    from: "eni-0251ac7de85dc0060",
    to: "applicationEndpoint (13.229.212.48)",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-0711d81c7b4f472f1",
  },
  {
    from: "eni-0711d81c7b4f472f1",
    to: "lb (ELB app/k8s-staging-lwmainap-e574a52742/db4ae0f5d4bfbc59 (ap-southeast-1b, 10.2.3.61))",
  },
  {
    from: "eni-0711d81c7b4f472f1",
    to: "applicationEndpoint (13.228.109.254)",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-0945968463ba9d66d",
  },
  {
    from: "eni-0945968463ba9d66d",
    to: "lb (ELB app/k8s-prod-lwwebapp-ddeafb7d02/e4d5de1bd24af57d (ap-southeast-1b, 10.2.3.200))",
  },
  {
    from: "eni-0945968463ba9d66d",
    to: "applicationEndpoint (52.76.214.172)",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-09e30df101bb184d9",
  },
  {
    from: "eni-09e30df101bb184d9",
    to: "lb (ELB aa81ac7baffb045488c9a345f23f5d69 (ap-southeast-1b, 10.2.3.165))",
  },
  {
    from: "eni-09e30df101bb184d9",
    to: "applicationEndpoint (13.251.140.131)",
  },
  {
    from: "prod-snet-pub (subnet-07adb4c97037b9770)",
    to: "eni-0fd2529c907dc99e3",
  },
  {
    from: "eni-0fd2529c907dc99e3",
    to: "ec2 (ubuntu-productioneks-ubuntu-productioneks-ng-Node (ap-southeast-1b, 10.2.3.251))",
  },
  {
    from: "vpc-prod (vpc-08021314689936822)",
    to: "prod-data (subnet-03d4dc15d714502d0)",
  },
  {
    from: "prod-data (subnet-03d4dc15d714502d0)",
    to: "eni-09b6870d410a992b5",
  },
  {
    from: "eni-09b6870d410a992b5",
    to: "lb (ELB app/web-prod/57b09a5655e9f806 (ap-southeast-1b, 10.2.11.228))",
  },
  {
    from: "eni-09b6870d410a992b5",
    to: "applicationEndpoint (54.255.1.4)",
  },
  {
    from: "prod-data (subnet-03d4dc15d714502d0)",
    to: "eni-0524723113e0d74b5",
  },
  {
    from: "eni-0524723113e0d74b5",
    to: "transitGW (Network Interface for Transit Gateway Attachment tgw-attach-0fadefb9eff283b00 (ap-southeast-1b, 10.2.11.114))",
  },
  {
    from: "prod-data (subnet-03d4dc15d714502d0)",
    to: "eni-0547a8205005aef79",
  },
  {
    from: "eni-0547a8205005aef79",
    to: "RDSNetworkInterface",
  },
  {
    from: "prod-data (subnet-03d4dc15d714502d0)",
    to: "eni-01992986e569da68b",
  },
  {
    from: "eni-01992986e569da68b",
    to: "RDSNetworkInterface",
  },
  {
    from: "prod-data (subnet-03d4dc15d714502d0)",
    to: "eni-0642126803d9bb6a4",
  },
  {
    from: "eni-0642126803d9bb6a4",
    to: "Amazon EKS ubuntu-productioneks",
  },
  {
    from: "prod-data (subnet-03d4dc15d714502d0)",
    to: "eni-0448efc3925ec6ff8",
  },
  {
    from: "eni-0448efc3925ec6ff8",
    to: "lb (ELB app/api-prod/c6c7049a1ba5246b (ap-southeast-1b, 10.2.11.36))",
  },
  {
    from: "eni-0448efc3925ec6ff8",
    to: "applicationEndpoint (54.179.193.49)",
  },
  {
    from: "vpc-prod (vpc-08021314689936822)",
    to: "prod-api (subnet-0bf3f2fd98df3043c)",
  },
  {
    from: "prod-api (subnet-0bf3f2fd98df3043c)",
    to: "eni-0e24a5873a4262603",
  },
  {
    from: "eni-0e24a5873a4262603",
    to: "transitGW (Network Interface for Transit Gateway Attachment tgw-attach-0fadefb9eff283b00 (ap-southeast-1a, 10.2.1.99))",
  },
  {
    from: "prod-api (subnet-0bf3f2fd98df3043c)",
    to: "eni-081c57c9efd9dd27d",
  },
  {
    from: "eni-081c57c9efd9dd27d",
    to: "RDSNetworkInterface",
  },
  {
    from: "prod-api (subnet-0bf3f2fd98df3043c)",
    to: "eni-0591f8d66ee5a83b7",
  },
  {
    from: "eni-0591f8d66ee5a83b7",
    to: "Interface for NAT Gateway nat-077284aae430cb8ea",
  },
  {
    from: "eni-0591f8d66ee5a83b7",
    to: "applicationEndpoint (18.142.155.242)",
  },
  {
    from: "prod-api (subnet-0bf3f2fd98df3043c)",
    to: "eni-0ddd666004ee3e720",
  },
  {
    from: "eni-0ddd666004ee3e720",
    to: "RDSNetworkInterface",
  },
  {
    from: "prod-api (subnet-0bf3f2fd98df3043c)",
    to: "eni-01767fdbe97d14fb8",
  },
  {
    from: "eni-01767fdbe97d14fb8",
    to: "lb (ELB app/api-prod/c6c7049a1ba5246b (ap-southeast-1a, 10.2.1.227))",
  },
  {
    from: "eni-01767fdbe97d14fb8",
    to: "applicationEndpoint (54.179.209.112)",
  },
  {
    from: "prod-api (subnet-0bf3f2fd98df3043c)",
    to: "eni-014774f7e84f46d8e",
  },
  {
    from: "eni-014774f7e84f46d8e",
    to: "elasticache (ElastiCache little-wallet-production-002 (ap-southeast-1a, 10.2.1.90))",
  },
  {
    from: "vpc-prod (vpc-08021314689936822)",
    to: "prod-snet-priv (subnet-0c26391e51a38aa41)",
  },
  {
    from: "prod-snet-priv (subnet-0c26391e51a38aa41)",
    to: "eni-082a319bff629bc10",
  },
  {
    from: "eni-082a319bff629bc10",
    to: "transitGW (Network Interface for Transit Gateway Attachment tgw-attach-0fadefb9eff283b00 (ap-southeast-1c, 10.2.4.150))",
  },
  {
    from: "prod-snet-priv (subnet-0c26391e51a38aa41)",
    to: "eni-06c45bbdc6ab8de13",
  },
  {
    from: "eni-06c45bbdc6ab8de13",
    to: "Amazon EKS ubuntu-productioneks",
  },
  {
    from: "prod-snet-priv (subnet-0c26391e51a38aa41)",
    to: "eni-053deea254406b0f9",
  },
  {
    from: "eni-053deea254406b0f9",
    to: "ELB net/a3e0a85cfb2de4ea68da79d1dc9cae48/ce09a1c6df3072e2",
  },
  {
    from: "eni-053deea254406b0f9",
    to: "applicationEndpoint (18.143.89.214)",
  },
  {
    from: "vpc-prod (vpc-08021314689936822)",
    to: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
  },
  {
    from: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
    to: "eni-04945b642da04280a",
  },
  {
    from: "eni-04945b642da04280a",
    to: "lb (ELB app/k8s-staging-lwwebapp-a5ad99036a/8570af602303e242 (ap-southeast-1a, 10.2.2.17))",
  },
  {
    from: "eni-04945b642da04280a",
    to: "applicationEndpoint (54.254.235.230)",
  },
  {
    from: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
    to: "eni-00267e91fe91d4540",
  },
  {
    from: "eni-00267e91fe91d4540",
    to: "lb (ELB app/k8s-staging-lwwebbac-05513e9cac/eded40bf05b970d0 (ap-southeast-1a, 10.2.2.146))",
  },
  {
    from: "eni-00267e91fe91d4540",
    to: "applicationEndpoint (52.221.16.137)",
  },
  {
    from: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
    to: "eni-031fe005de902324a",
  },
  {
    from: "eni-031fe005de902324a",
    to: "lb (ELB app/k8s-prod-lwwebapp-ddeafb7d02/e4d5de1bd24af57d (ap-southeast-1a, 10.2.2.228))",
  },
  {
    from: "eni-031fe005de902324a",
    to: "applicationEndpoint (54.255.146.148)",
  },
  {
    from: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
    to: "eni-0c6e06d644afb7d66",
  },
  {
    from: "eni-0c6e06d644afb7d66",
    to: "lb (ELB app/k8s-staging-lwwebapp-97d0c777bb/623fd4be4c6382c1 (ap-southeast-1a, 10.2.2.19))",
  },
  {
    from: "eni-0c6e06d644afb7d66",
    to: "applicationEndpoint (52.220.96.172)",
  },
  {
    from: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
    to: "eni-0961b5a3d944c63b8",
  },
  {
    from: "eni-0961b5a3d944c63b8",
    to: "ec2 (ubuntu-productioneks-ubuntu-productioneks-ng-Node (ap-southeast-1a, 10.2.2.142))",
  },
  {
    from: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
    to: "eni-05c635fee9437b1f9",
  },
  {
    from: "eni-05c635fee9437b1f9",
    to: "lb (ELB app/k8s-prod-lwmainap-e8103f1037/d3873c9bbee29c3b (ap-southeast-1a, 10.2.2.98))",
  },
  {
    from: "eni-05c635fee9437b1f9",
    to: "applicationEndpoint (52.74.237.154)",
  },
  {
    from: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
    to: "eni-07f5ec2d3108d5c73",
  },
  {
    from: "eni-07f5ec2d3108d5c73",
    to: "lb (ELB app/k8s-prod-skooliee-6469a7b209/1d5d684b11c5ca4b (ap-southeast-1a, 10.2.2.196))",
  },
  {
    from: "eni-07f5ec2d3108d5c73",
    to: "applicationEndpoint (52.76.135.118)",
  },
  {
    from: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
    to: "eni-0250a416566b67784",
  },
  {
    from: "eni-0250a416566b67784",
    to: "ec2 (ubuntu-productioneks-ubuntu-productioneks-ng-Node (ap-southeast-1a, 10.2.2.195))",
  },
  {
    from: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
    to: "eni-0293a48f0ad1984fa",
  },
  {
    from: "eni-0293a48f0ad1984fa",
    to: "lb (ELB app/k8s-prod-lwwebbac-aa101cb779/a77364603178de9d (ap-southeast-1a, 10.2.2.24))",
  },
  {
    from: "eni-0293a48f0ad1984fa",
    to: "applicationEndpoint (54.179.102.225)",
  },
  {
    from: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
    to: "eni-0f0bd58004fb4ab1f",
  },
  {
    from: "eni-0f0bd58004fb4ab1f",
    to: "lb (ELB app/k8s-default-apiwebli-58af1eb88e/783ea82461ccdd48 (ap-southeast-1a, 10.2.2.50))",
  },
  {
    from: "eni-0f0bd58004fb4ab1f",
    to: "applicationEndpoint (54.179.114.18)",
  },
  {
    from: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
    to: "eni-03b5f0c855e9fb432",
  },
  {
    from: "eni-03b5f0c855e9fb432",
    to: "lb (ELB app/k8s-prod-skooliee-a4867050b5/73b7b6624f2159a9 (ap-southeast-1a, 10.2.2.95))",
  },
  {
    from: "eni-03b5f0c855e9fb432",
    to: "applicationEndpoint (52.221.77.223)",
  },
  {
    from: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
    to: "eni-08164a42ae35e0da0",
  },
  {
    from: "eni-08164a42ae35e0da0",
    to: "lb (ELB app/k8s-prod-lwwebapp-ddeafb7d02/e4d5de1bd24af57d (ap-southeast-1a, 10.2.2.87))",
  },
  {
    from: "eni-08164a42ae35e0da0",
    to: "applicationEndpoint (54.179.185.16)",
  },
  {
    from: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
    to: "eni-03fb6f553450327ac",
  },
  {
    from: "eni-03fb6f553450327ac",
    to: "lb (ELB app/k8s-prod-lwwebapp-da43153f0a/2f924555b84df3a9 (ap-southeast-1a, 10.2.2.21))",
  },
  {
    from: "eni-03fb6f553450327ac",
    to: "applicationEndpoint (54.169.166.140)",
  },
  {
    from: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
    to: "eni-0aa71e40d451d0391",
  },
  {
    from: "eni-0aa71e40d451d0391",
    to: "ELB net/a3e0a85cfb2de4ea68da79d1dc9cae48/ce09a1c6df3072e2",
  },
  {
    from: "eni-0aa71e40d451d0391",
    to: "applicationEndpoint (52.221.70.105)",
  },
  {
    from: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
    to: "eni-0f230d0e1bc3b63b2",
  },
  {
    from: "eni-0f230d0e1bc3b63b2",
    to: "lb (ELB app/web-prod/57b09a5655e9f806 (ap-southeast-1a, 10.2.2.223))",
  },
  {
    from: "eni-0f230d0e1bc3b63b2",
    to: "applicationEndpoint (54.254.250.173)",
  },
  {
    from: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
    to: "eni-0d51dc0f39312fe2e",
  },
  {
    from: "eni-0d51dc0f39312fe2e",
    to: "lb (ELB aec646050e2964c3cbaf1e0c2f3a918f (ap-southeast-1a, 10.2.2.246))",
  },
  {
    from: "eni-0d51dc0f39312fe2e",
    to: "applicationEndpoint (13.228.51.190)",
  },
  {
    from: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
    to: "eni-024c19bd4deeab193",
  },
  {
    from: "eni-024c19bd4deeab193",
    to: "ec2 (ubuntu-productioneks-ubuntu-productioneks-ng-Node (ap-southeast-1a, 10.2.2.216))",
  },
  {
    from: "eni-024c19bd4deeab193",
    to: "applicationEndpoint (54.255.207.151)",
  },
  {
    from: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
    to: "eni-0f0923cad3e5d61f9",
  },
  {
    from: "eni-0f0923cad3e5d61f9",
    to: "ec2 (ubuntu-productioneks-ubuntu-productioneks-ng-Node (ap-southeast-1a, 10.2.2.140))",
  },
  {
    from: "eni-0f0923cad3e5d61f9",
    to: "applicationEndpoint (18.141.160.190)",
  },
  {
    from: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
    to: "eni-00119c43cf108c5f5",
  },
  {
    from: "eni-00119c43cf108c5f5",
    to: "lb (ELB aa81ac7baffb045488c9a345f23f5d69 (ap-southeast-1a, 10.2.2.91))",
  },
  {
    from: "eni-00119c43cf108c5f5",
    to: "applicationEndpoint (18.136.158.68)",
  },
  {
    from: "subnet-ubuntu-productioneks-pub (subnet-09fe4751523d641f3)",
    to: "eni-00961344376477a63",
  },
  {
    from: "eni-00961344376477a63",
    to: "lb (ELB app/k8s-staging-lwmainap-e574a52742/db4ae0f5d4bfbc59 (ap-southeast-1a, 10.2.2.59))",
  },
  {
    from: "eni-00961344376477a63",
    to: "applicationEndpoint (13.228.128.2)",
  },
];
const AnyChart = (props) => {
  const { netList, networkList } = props || {};
  const [anchorEl, setAnchorEl] = useState(false);
  const [showData, setShowData] = useState({});
  const theme = useTheme();
  const [selectVpc, setSelectVpc] = useState([]);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  console.log("~ netListnetList", netList);

  // useEffect(() => {
  //   if (netList.length > 0) {
  //     setSelectVpc([netList[0].data[0]]);
  //   }
  // }, [netList]);

  const mainData = useMemo(() => {
    let allSeries = [];
    let allVPC = [];
    let connectedSub = [];
    let popupData = [];

    selectVpc.map((_item) => {
      const protectedBy = _item.protectedBy;
      // allVPC.push(_item.name);
      // let itemName = _item.name + _item.protectedBy;

      let vpcName = _item?.name ? _item.name + " (" + _item.id + ")" : _item.id;

      allVPC.push(vpcName);
      // allSeries.push([_item.name, _item.name]);

      const popupObj = {
        name: vpcName,
        data: {
          id: _item.id,
          name: _item?.name,
          type: _item.type,
          protectedBy: protectedBy,
        },
      };
      popupData.push(popupObj);

      _item.subnets.map((subnet) => {
        const subnetName = subnet.name
          ? subnet.name + " (" + subnet.id + ")"
          : subnet.id;
        if (subnet.connected) {
          connectedSub.push(subnetName);
        }
        allSeries.push([vpcName, subnetName]);

        // allSeries.push([_item.name, subnetName]);

        const popupObj = {
          name: subnetName,
          data: {
            id: subnet.id,
            name: subnet.name,
            type: subnet.type,
            protectedBy: subnet.connected ? protectedBy : "NOT PROTECTED",
          },
        };
        popupData.push(popupObj);

        subnet.networkInterfaces.map((netInt) => {
          // const networkInterfaceName = netInt?.name || netInt?.id;

          const networkInterfaceName = netInt?.name
            ? netInt?.name + " (" + netInt?.id + ")"
            : netInt?.id;
          allSeries.push([subnetName, networkInterfaceName]);

          const popupObj = {
            name: networkInterfaceName,
            data: {
              id: netInt.id,
              name: netInt.name,
              type: "network interface",
              protectedBy: protectedBy,
            },
          };
          popupData.push(popupObj);

          netInt.objects.map((obj) => {
            // const obj1 = obj.type != "" ? obj.type : obj.name;
            const name = obj.publicIp || obj.name + " (" + obj.az + ")";
            const newobj = obj.type ? obj.type + " (" + name + ")" : obj.name;
            allSeries.push([networkInterfaceName, newobj || obj.publicIp]);

            const popupObj = {
              name: newobj,
              data: {
                id: obj.id,
                name: obj.publicIp || obj.name,
                publicIp: obj?.publicIp,
                type:
                  obj.type == "applicationEndpoint"
                    ? "application endpoint"
                    : obj.type,
                protectedBy: protectedBy,
              },
            };
            popupData.push(popupObj);
          });
        });
      });
    });

    const onlyFrom = linkDataArray.map((parent) => {
      return {
        id: parent.from,
        // fill: {
        //   src:
        //     allVPC.includes(parent.from) &&
        //     `${window.location.origin}/images/vpc_blue1.svg`,
        // },
      };
    });

    const onlyTo = linkDataArray.map((parent) => {
      return { id: parent.to };
    });
    const newArr = [...onlyFrom, ...onlyTo];
    let unique = [...new Set(newArr.map((item) => item.id))];
    let uniqueWithId = unique.map((item) => {
      let dataToReturn = {
        id: item,
      };
      if (item.includes("vpc")) {
        let fill = {
          src: `${window.location.origin}/images/vpc_blue1.svg`,
        };
        dataToReturn.fill = fill;
        return dataToReturn;
      }
      if (item.includes("subnet")) {
        let fill = {
          src: `${window.location.origin}/images/subnet_red.svg`,
        };
        dataToReturn.fill = fill;
        return dataToReturn;
      }
      if (item.includes("eni")) {
        let fill = {
          src: `${window.location.origin}/images/interface_orange.svg`,
        };
        dataToReturn.fill = fill;
        return dataToReturn;
      }

      if (item.includes("ec2")) {
        let fill = {
          src: `${window.location.origin}/images/awsimg/aws-ec2.svg`,
        };
        dataToReturn.fill = fill;
        return dataToReturn;
      }

      if (item.includes("rds")) {
        let fill = {
          src: `${window.location.origin}/images/awsimg/aws-rds.svg`,
        };
        dataToReturn.fill = fill;
        return dataToReturn;
      }

      if (item.includes("lambda")) {
        let fill = {
          src: `${window.location.origin}/images/awsimg/aws-lambda-1.svg`,
        };
        dataToReturn.fill = fill;
        return dataToReturn;
      }

      return dataToReturn;
    });

    console.log("~ uniqueWithId", uniqueWithId);

    const allD = linkDataArray.map((parent, key) => {
      return { from: parent.from, to: parent.to };
    });

    return { allSeries, allVPC, connectedSub, popupData, uniqueWithId, allD };
  }, [selectVpc, linkDataArray, netList]);

  const { allSeries, allVPC, connectedSub, popupData, uniqueWithId, allD } =
    mainData;
  console.log("~ allVPCaasa", allVPC);

  useEffect(() => {
    anychart.onDocumentReady(function () {
      // create data
      var data = {
        nodes: uniqueWithId,
        edges: allD,
      };

      console.log(data, "datawqrqweqweqwe");

      // create a chart and set the data
      var chart = anychart.graph(data);

      // set the chart title
      chart.title("Network Graph: Basic Sample");

      // set the container id
      chart.container("container");

      // initiate drawing the chart
      chart.draw();
    });
  }, [linkDataArray, uniqueWithId, allD]);

  return (
    <Box>
      <figure className="highcharts-figure">
        <div
          id={"container"}
          className="networkClass"
          style={{ height: "100vh" }}
        ></div>
      </figure>
    </Box>
  );
};

export default AnyChart;
