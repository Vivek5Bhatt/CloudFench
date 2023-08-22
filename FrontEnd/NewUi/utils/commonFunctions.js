import jwtDecode from "jwt-decode";
import CryptoJS from "crypto-js";
import Countries from "utils/countries.json";
import Image from "next/image";
import AWSEC2 from "public/images/awsimg/aws-ec2.svg";
import AWSLambda from "public/images/awsimg/aws-lambda-1.svg";
import AWSRds from "public/images/awsimg/aws-rds.svg";
import AWSElasticache from "public/images/awsimg/aws-Elasti-cache.svg";
import AWSLoadBalancer from "public/images/awsimg/aws-load-balancer.svg";
import AWSLB from "public/images/awsimg/load-balancer-icon-3.png";
import AWStransitGW from "public/images/awsimg/20_vpc-customer-gateway.500b29e8da.png";

import moment from "moment";

export const shortContent = (content, limit) => {
  try {
    var dots = "...";
    if (content.length > limit) {
      // you can also use substr instead of substring
      content = content.substring(0, limit) + dots;
    }
    return content;
  } catch (err) {
    return content;
  }
};

export const firstLetterCapital = (sentence) => {
  try {
    const words = sentence.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(" ");
  } catch (err) {
    return sentence;
  }
};

export const isTokenExpired = (token) => {
  try {
    if (!token) {
      return true;
    }
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (err) {
    return true;
  }
};

export const encryptPayload = (data) => {
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    process.env.NEXT_PUBLIC_SECRET_KEY
  ).toString();
  return ciphertext;
};

export const countryFlags = (countryName) => {
  const countryCode = Countries.find((country) => country.name === countryName);
  return countryCode?.code ? (
    <Image
      src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode?.code}.svg`}
      alt="Country Flag"
      width={20}
      height={15}
    />
  ) : (
    ""
  );
};

export const showAWSIconAndClass = (rowData, isSource = false, type = 1) => {
  try {
    if (rowData) {
      let data = "";
      if (isSource) {
        data =
          rowData?.srcinfo && rowData?.srcinfo?.Type
            ? rowData?.srcinfo?.Type
            : "";
      } else {
        data =
          rowData?.dstinfo && rowData?.dstinfo?.Type
            ? rowData?.dstinfo?.Type
            : "";
      }
      switch (data) {
        case "ec2":
          return type == 1 ? (
            <Image src={AWSEC2} alt="aws ec2" width={18} />
          ) : (
            "ec2-box"
          );
        case "lambda":
          return type == 1 ? (
            <Image src={AWSLambda} alt="aws lambda" width={18} />
          ) : (
            "lambda-box"
          );
        case "rds":
          return type == 1 ? (
            // <Box
            //   className="flag_icon"
            //   sx={{
            //     display: "flex",
            //     marginRight: "4px",
            //   }}
            // >
            <Image src={AWSRds} alt="aws rds" width={18} />
          ) : (
            // </Box>
            "rds-box"
          );
        case "elasticache":
          AWSElasticache;
          return type == 1 ? (
            // <Box
            //   className="flag_icon"
            //   sx={{
            //     display: "flex",
            //     marginRight: "4px",
            //   }}
            // >
            <Image src={AWSElasticache} alt="aws elasticache" width={18} />
          ) : (
            // </Box>
            "elasticache-box"
          );
        case "loadbalancer":
          return type == 1 ? (
            // <Box
            //   className="flag_icon"
            //   sx={{
            //     display: "flex",
            //     marginRight: "4px",
            //   }}
            // >
            <Image src={AWSLoadBalancer} alt="aws loadbalancer" width={18} />
          ) : (
            // </Box>
            "loadbalancer-box"
          );

        case "lb":
          return type == 1 ? (
            <Image src={AWSLB} alt="aws lb" width={18} />
          ) : (
            "lb"
          );

        case "transitGW":
          return type == 1 ? (
            <Image src={AWStransitGW} alt="aws transit" width={18} />
          ) : (
            "transitGW"
          );
        default:
          return "";
      }
    }
    return "";
  } catch (err) {
    return "";
  }
};

export const useCaseServiceName = {
  webWorkLoad: "Web Workload and API Protection",
  secureConnectivity: "Workload Secure internet access",
  workloadProtection: "Workload Internal Segmentation",
  waf: "Web Workload and API Protection",
  secure_nat_gw: " Workload Secure internet access",
  internal_segmentation: "Workload Internal Segmentation",
  sslvpn: "Secure User Access",
};

export const getFormatedDate = (date, format = "DD/MM/YYYY") => {
  return moment(date).format(format);
};
