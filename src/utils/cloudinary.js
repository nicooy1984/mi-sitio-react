export const uploadImageToCloudinary = async (file, folder = 'general') => {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('upload_preset', 'colegioitalianosp');
  formData.append('folder', folder);

  const res = await fetch(
    'https://api.cloudinary.com/v1_1/dl3eqt8e2/image/upload',
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || 'Error al subir imagen a Cloudinary');
  }

  return data.secure_url;
};