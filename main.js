import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import axios from "axios";

const endpoint = "https://s3.us-east-005.backblazeb2.com";
const region = "us-east-005";
const bucket = "storybrain-test-bucket";
const APPLICATION_KEY_ID = "6f9737d37864";
const APPLICATION_KEY = "0051182a8210ef6d6cb7c48823385fe13500e118cb";


document.addEventListener("DOMContentLoaded", async () => {
  const uploadButton = document.getElementById("uploadButton");
  const fileInput = document.getElementById("fileInput");
  const responseDiv = document.getElementById("response");

  uploadButton.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (!file) {
      responseDiv.textContent = "Please select a file.";
      return;
    }
    console.log(file.name);

    const client = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId: APPLICATION_KEY_ID,
        secretAccessKey: APPLICATION_KEY,
      },
    });
    

    const expiresIn = 7 * 24 * 60 * 60;
    const command = new PutObjectCommand({ Bucket: bucket, Key: file.name, Body: "hello" });
    const signedUrl = await getSignedUrl(client, command, { expiresIn });

    await axios.put(signedUrl, "hello");
  });
});
