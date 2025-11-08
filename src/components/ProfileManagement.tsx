import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  User, 
  Camera, 
  MapPin, 
  Phone, 
  Mail,
  Save,
  Upload,
  History,
  Edit
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../lib/api/users';
import { toast } from 'sonner@2.0.3';
import { User as UserType } from '../types/user';

export function ProfileManagement() {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activityHistory, setActivityHistory] = useState<any[]>([]);

  const [formData, setFormData] = useState<Partial<UserType>>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || user?.phoneNumber || '',
    state: user?.state || '',
    district: user?.district || '',
    village: user?.village || '',
    landSize: user?.landSize || '',
    crops: user?.crops || []
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || user.phoneNumber || '',
        state: user.state || '',
        district: user.district || '',
        village: user.village || '',
        landSize: user.landSize || '',
        crops: user.crops || []
      });

      // Load activity history
      if (user.id) {
        loadActivityHistory();
      }
    }
  }, [user]);

  const loadActivityHistory = async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await userAPI.getUserActivity(user.id);
      if (error) {
        console.error('Error loading activity:', error);
      } else {
        setActivityHistory(data || []);
      }
    } catch (error) {
      console.error('Error loading activity:', error);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('User not found. Please log in again.');
      return;
    }

    // Validate required fields
    if (!formData.name || formData.name.trim() === '') {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      // Normalize phone field (handle both phone and phoneNumber)
      const updates = {
        ...formData,
        phone: formData.phone || formData.phoneNumber,
        phoneNumber: formData.phone || formData.phoneNumber
      };

      const { error } = await updateProfile(updates);
      if (error) {
        console.error('Profile update error:', error);
        const errorMessage = error?.message || error?.toString() || 'Failed to update profile';
        toast.error(`Failed to update profile: ${errorMessage}`);
      } else {
        toast.success('Profile updated successfully');
        // Reload activity history to show the update
        await loadActivityHistory();
      }
    } catch (error: any) {
      console.error('Profile update exception:', error);
      const errorMessage = error?.message || 'Failed to update profile';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const { error, publicUrl } = await userAPI.uploadProfilePicture(user.id, file);
      if (error) {
        console.error('Image upload error:', error);
        const errorMessage = error?.message || 'Failed to upload image';
        toast.error(`Failed to upload image: ${errorMessage}`);
      } else if (publicUrl) {
        const { error: updateError } = await updateProfile({ profileImage: publicUrl });
        if (updateError) {
          console.error('Profile update error after image upload:', updateError);
          toast.error('Image uploaded but failed to update profile');
        } else {
          toast.success('Profile picture updated successfully');
          // Reload activity history to show the update
          await loadActivityHistory();
        }
      } else {
        toast.error('Image upload completed but no URL returned');
      }
    } catch (error: any) {
      console.error('Image upload exception:', error);
      const errorMessage = error?.message || 'Failed to upload image';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const handleCropChange = (index: number, value: string) => {
    const crops = [...(formData.crops || [])];
    crops[index] = value;
    setFormData({ ...formData, crops });
  };

  const addCrop = () => {
    const crops = [...(formData.crops || []), ''];
    setFormData({ ...formData, crops });
  };

  const removeCrop = (index: number) => {
    const crops = formData.crops?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, crops });
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please log in to view your profile</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="activity">Activity History</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={user.profileImage} alt={user.name} />
                  <AvatarFallback className="bg-green-100 text-green-800 text-2xl">
                    {user.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        {user.profileImage ? 'Change Picture' : 'Upload Picture'}
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-gray-500">Max file size: 5MB</p>
                </div>
              </div>

              {/* Profile Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="village">Village</Label>
                  <Input
                    id="village"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  />
                </div>

                {user.role === 'farmer' && (
                  <>
                    <div>
                      <Label htmlFor="landSize">Land Size</Label>
                      <Input
                        id="landSize"
                        value={formData.landSize}
                        onChange={(e) => setFormData({ ...formData, landSize: e.target.value })}
                        placeholder="e.g., 5.2 acres"
                      />
                    </div>

                    <div>
                      <Label>Crops</Label>
                      <div className="space-y-2">
                        {formData.crops?.map((crop, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={crop}
                              onChange={(e) => handleCropChange(index, e.target.value)}
                              placeholder="Crop name"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeCrop(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addCrop}
                        >
                          Add Crop
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <div className="space-y-4">
                {activityHistory.length > 0 ? (
                  activityHistory.map((activity, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{activity.action || 'Activity'}</p>
                            <p className="text-sm text-gray-500">{activity.description}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(activity.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No activity history yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

