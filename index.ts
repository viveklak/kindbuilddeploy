import * as docker from "@pulumi/docker";
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

const imageName = "ruby-app";

const myImage = new docker.Image(imageName, {
    imageName: pulumi.interpolate`localhost:5000/${imageName}:latest`,
    build: {
        env: {"DOCKER_BUILDKIT": "1"},
        context: "./app",
    },
});

const appLabels = { app: "app" };
const deployment = new k8s.apps.v1.Deployment("app", {
    spec: {
        selector: { matchLabels: appLabels },
        replicas: 1,
        template: {
            metadata: { labels: appLabels },
            spec: { containers: [{ name: "app", image: myImage.baseImageName }] }
        }
    }
});
export const deploymentName = deployment.metadata.name;
