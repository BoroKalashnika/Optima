const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dhfvnvuox/video/upload';
const CLOUDINARY_UPLOAD_PRESET = 'optima';

const uploadVideo = async (videoFile, setVideo) => {
  let formData = new FormData();
  formData.append('file', {
    uri: videoFile,
    type: 'video/mp4',
    name: 'upload.mp4',
  });
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    let response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    let data = await response.json();
    if (data.secure_url) {
      setVideo(data.secure_url);
      return 'Video uploaded successfully!';
    } else {
      return 'Failed to upload video';
    }
  } catch (error) {
    return 'Something went wrong while uploading';
  }
};

export default uploadVideo;