const fs = require('fs');

// 1. Update userController.ts
let userController = fs.readFileSync('server/src/controllers/userController.ts', 'utf8');
if (!userController.includes('updateAvatar')) {
  userController += `
export const updateAvatar = async (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }
    const avatarUrl = req.file.path;
    const user = await User.findByIdAndUpdate(req.user.id, { avatar: avatarUrl }, { new: true }).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
};
`;
  fs.writeFileSync('server/src/controllers/userController.ts', userController);
}

// 2. Update userRoutes.ts
let userRoutes = fs.readFileSync('server/src/routes/userRoutes.ts', 'utf8');
if (!userRoutes.includes('updateAvatar')) {
  userRoutes = userRoutes.replace(
    "import { getProfile, updateProfile } from '../controllers/userController';",
    "import { getProfile, updateProfile, updateAvatar } from '../controllers/userController';\nimport { upload } from '../middleware/uploadMiddleware';"
  );
  userRoutes = userRoutes.replace(
    "export default router;",
    "router.put('/profile/avatar', protect, upload.single('avatar'), updateAvatar);\n\nexport default router;"
  );
  fs.writeFileSync('server/src/routes/userRoutes.ts', userRoutes);
}

console.log('Fixed backend avatar upload');
