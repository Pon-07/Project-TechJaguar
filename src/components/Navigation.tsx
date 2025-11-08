import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { 
  Sprout, 
  Warehouse, 
  ShoppingCart, 
  Store,
  Globe, 
  Coins,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Shield
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
import { NavigationProps } from '../types/user';
import { EnhancedIcon, getThemeColor } from './EnhancedIcon';
import greenledgerIcon from 'figma:asset/d9d6690fe8217fe6f83131e251ea5ff18890f6e0.png';

export function Navigation({ activeModule, setActiveModule, user, onLogout }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const modules = [
    { id: 'farmer', label: t('nav.farmerHub'), icon: Sprout, color: 'bg-green-500', theme: 'farmer' as const },
    { id: 'warehouse', label: t('nav.warehouse'), icon: Warehouse, color: 'bg-amber-500', theme: 'warehouse' as const },
    { id: 'consumer', label: t('nav.consumer'), icon: ShoppingCart, color: 'bg-blue-500', theme: 'consumer' as const },
    { id: 'uzhavan', label: 'Uzhavan Santhai', icon: Store, color: 'bg-purple-500', theme: 'uzhavan' as const }
  ];

  const handleModuleChange = useCallback((moduleId: string) => {
    setActiveModule(moduleId as 'farmer' | 'warehouse' | 'consumer' | 'uzhavan' | 'profile' | 'admin');
  }, [setActiveModule]);

  const handleMobileMenuClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-green-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <img 
                src={greenledgerIcon} 
                alt="Greenledger Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-green-800">Greenledger</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {modules.map((module) => (
              <motion.div
                key={module.id}
                className="relative"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant={activeModule === module.id ? "default" : "ghost"}
                  onClick={() => handleModuleChange(module.id)}
                  className="relative flex items-center gap-2 px-4 py-2 transition-all duration-300"
                >
                  <EnhancedIcon
                    icon={module.icon}
                    size="sm"
                    glowColor={getThemeColor(module.theme)}
                    isActive={activeModule === module.id}
                    pulse={true}
                  />
                  <span className="relative z-10">{module.label}</span>
                  {activeModule === module.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-green-100 rounded-md -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            
            {/* Green Points */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Badge variant="secondary" className="bg-green-100 text-green-800 relative overflow-hidden">
                <EnhancedIcon
                  icon={Coins}
                  size="sm"
                  glowColor="rgb(34, 197, 94)"
                  pulse={true}
                  className="mr-1"
                />
                1,250 {t('nav.greenPoints')}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-100, 100] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </Badge>
            </motion.div>

            {/* User Avatar */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage 
                        src={user.profileImage || "/api/placeholder/32/32"} 
                        alt={`${user.name || 'User'} profile picture`}
                      />
                      <AvatarFallback className="bg-green-100 text-green-800">
                        {user.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="font-medium leading-none">{user.name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.state}, {user.district}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    if (setActiveModule) {
                      setActiveModule('profile' as any);
                    }
                  }}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <DropdownMenuItem onClick={() => {
                      if (setActiveModule) {
                        setActiveModule('admin' as any);
                      }
                    }}>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={onLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Avatar>
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-green-200"
          >
            <div className="space-y-2">
              {modules.map((module) => (
                <Button
                  key={module.id}
                  variant={activeModule === module.id ? "default" : "ghost"}
                  onClick={() => {
                    handleModuleChange(module.id);
                    handleMobileMenuClose();
                  }}
                  className="w-full justify-start flex items-center gap-2"
                >
                  <EnhancedIcon
                    icon={module.icon}
                    size="sm"
                    glowColor={getThemeColor(module.theme)}
                    isActive={activeModule === module.id}
                    pulse={true}
                  />
                  {module.label}
                </Button>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-green-200">
                <LanguageSelector />
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Coins className="w-3 h-3 mr-1" />
                  1,250 {t('nav.greenPoints')}
                </Badge>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}