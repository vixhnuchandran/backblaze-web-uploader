import axios from "axios";


document.addEventListener("DOMContentLoaded", async() => {
    const uploadButton = document.getElementById("uploadButton");
    const fileInput = document.getElementById("fileInput");
    const responseDiv = document.getElementById("response");

    uploadButton.addEventListener("click", async () => {
      const file = fileInput.files[0];
      const filename = Date.now() + "-" + file.name;

      if (!file) {
        responseDiv.textContent = "Please select a file.";
        return;
      }

      try {

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async () => {
          const arrayBuffer = reader.result;
          const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const fileHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

          const config = {
            method: "put",
            maxBodyLength: Infinity,
            url: `https://s3.us-east-005.backblazeb2.com/storybrain-test-bucket/${filename}`,
            headers: {
              "Content-Type": file.type,
              "X-Amz-Content-Sha256": fileHash,
              "X-Amz-Date": new Date().toISOString().replace(/[:-]|\.\d{3}/g, '') + 'Z',
              Authorization:
                "AWS4-HMAC-SHA256 Credential=0056f9737d378640000000003/20240625/us-east-1/execute-api/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-date, Signature=06c62bfe2733184977e406cdd699589bc3434caed8fef4e2ea44e813b4538cf8",
            },
            data: file,
          };

          const response = await axios.request(config);
          const fileUrl = `https://f005.backblazeb2.com/file/storybrain-test-bucket/${filename}`;
          responseDiv.textContent = `File uploaded successfully: ${fileUrl}`;
          console.log("Upload response:", response.data);
        };
      } catch (error) {
        responseDiv.textContent = `Error uploading file: ${error}`;
        console.error("Upload error:", error);
      }
    });
  });