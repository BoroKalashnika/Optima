import config from '../../config/config';

const uploadVideo = async (videoFile) => {
  let formData = new FormData();
  formData.append('file', {
    uri: videoFile,
    type: 'video/mp4',
    name: 'upload.mp4',
  });
  formData.append('upload_preset', config.CLOUDINARY_UPLOAD_PRESET);

  try {
    let response = await fetch(config.CLOUDINARY_URL, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    let data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      return 'Failed to upload video';
    }
  } catch (error) {
    return 'Failed to upload video';
  }
};

export default uploadVideo;