import { S3Client, PutObjectCommand, } from "@aws-sdk/client-s3"
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

      document.addEventListener("DOMContentLoaded", async () => {
        const uploadButton = document.getElementById("uploadButton")
        const fileInput = document.getElementById("fileInput")
        const responseDiv = document.getElementById("response")

        uploadButton.addEventListener("click", async () => {
          const file = fileInput.files[0]

          const bucketName = "storybrain-test-bucket"
          const keyName = Date.now() + "-" + file.name

          if (!file) {
            responseDiv.textContent = "Please select a file."
            return
          }
          const s3 = new S3Client({
            endpoint: "https://s3.us-east-005.backblazeb2.com",
            region: "us-east-005",
            credentials: {
              accessKeyId: "0056f9737d378640000000004",
              secretAccessKey: "K005HKXoNUJOehLHtBj3C9ctEaDDRZg",
            },
          })

          const expiresIn = 7 * 24 * 60 * 60;
          const command = new PutObjectCommand({ Bucket: bucketName, Key: keyName });
          const signedUrl = await getSignedUrl(s3, command, { expiresIn })

          try {
            const putRes = await axios.put(signedUrl, file);
            console.log("putRes: ", putRes)

            const fileUrl = `https://f005.backblazeb2.com/file/${bucketName}/${keyName}`

            responseDiv.textContent = fileUrl
          } catch (err) {
            console.log("Error: ", err)
            responseDiv.textContent = "Upload failes! Try again later."
          }
        })
      })