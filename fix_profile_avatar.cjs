const fs = require('fs');
let profile = fs.readFileSync('client/src/features/users/pages/Profile.tsx', 'utf8');

profile = profile.replace(
  /const reader = new FileReader\(\);[\s\S]*?reader\.readAsDataURL\(file\);/m,
  `
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const { data } = await api.put('/users/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfileData(data.data);
      dispatch(updateUser(data.data));
      toast.success('Avatar updated successfully');
    } catch (err) {
      toast.error('Failed to update avatar');
    }
  `
);

fs.writeFileSync('client/src/features/users/pages/Profile.tsx', profile);
console.log('Fixed profile avatar upload');
