import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../api/services';

/**
 * Hook to fetch user profile
 * @param {Object} options - Query options
 * @param {boolean} options.enabled - Whether the query should run
 */
export const useProfile = (options = {}) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(false), // Don't use cache, let React Query handle it
    staleTime: 1000 * 60 * 15, // 15 minutes - profile doesn't change often
    gcTime: 1000 * 60 * 30, // 30 minutes cache
    ...options,
  });
};

/**
 * Hook to update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileData) => profileService.updateProfile(profileData),
    onSuccess: (data) => {
      // Only update cache, don't refetch
      queryClient.setQueryData(['profile'], data);
    },
  });
};

/**
 * Hook to upload profile image
 */
export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file) => profileService.uploadProfileImage(file),
    onSuccess: () => {
      // Refetch profile to get updated image URL
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

/**
 * Hook to upload ID documents
 */
export const useUploadID = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idFront, idBack }) => profileService.uploadID(idFront, idBack),
    onSuccess: () => {
      // Refetch profile to get updated verification status
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

/**
 * Hook to change password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }) => 
      profileService.changePassword(currentPassword, newPassword),
  });
};

/**
 * Hook to toggle 2FA
 */
export const useToggle2FA = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => profileService.toggle2FA(),
    onSuccess: () => {
      // Refetch profile to get updated 2FA status
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
