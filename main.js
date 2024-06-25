import axios from "axios"


document.addEventListener("DOMContentLoaded", () => {
  const uploadButton = document.getElementById("uploadButton")
  const fileInput = document.getElementById("fileInput")
  const responseDiv = document.getElementById("response")

  uploadButton.addEventListener("click", async () => {
    const file = fileInput.files[0]
    const filename =  Date.now()+'-'+file.name
    if (!file) {
      responseDiv.textContent = "Please select a file."
      return
    }

    console.log(file)

    try {
      const config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `https://s3.us-east-005.backblazeb2.com/storybrain-test-bucket/${filename}`,
        headers: {
          "Content-Type": file.type,
          "X-Amz-Content-Sha256":
            "beaead3198f7da1e70d03ab969765e0821b24fc913697e929e726aeaebf0eba3",
          "X-Amz-Date": "20240625T020625Z",
          Authorization:
            "AWS4-HMAC-SHA256 Credential=0056f9737d378640000000002/20240625/us-east-1/execute-api/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-content-sha256;x-amz-date, Signature=9ad9d7e116f757d8032bd97b2326cd10ca8029ebf4e35a75f71938b9e452e4d1",
        },
        data: file,
      }

      const response = await axios.request(config)
      const fileUrl = `https://f005.backblazeb2.com/file/storybrain-test-bucket/${filename}`
      responseDiv.textContent = fileUrl
      console.log("Upload response:", response.data)
    } catch (error) {
      responseDiv.textContent = `Error uploading file: ${error}`
      console.error("Upload error:", error)
    }
  })

})
