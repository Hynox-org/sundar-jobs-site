'use client';

import FullScreenMenu from '../../components/FullScreenMenu';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { useRouter } from 'next/navigation'; // Using next/navigation for router
import React, { useEffect, useRef, useState } from 'react';
import { Home, Menu, MessageCircle, Facebook, Instagram, Smartphone, Monitor } from 'lucide-react'; // Replaced Ionicons
import Image from 'next/image'; // For Next.js image optimization

// Replaced React Native Animated components with basic web elements
// import { Animated, Easing, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PostJobsLayout({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const textColor = Colors[colorScheme ?? 'light'].text;
  const backgroundColor = Colors[colorScheme ?? 'light'].background;

  // Removing React Native Animated components and using plain div/button for social icons
  // const animatedScale = useRef(new Animated.Value(1)).current;
  // useEffect(() => {
  //   const animateSocialIcons = () => {
  //     Animated.loop(
  //       Animated.sequence([
  //         Animated.timing(animatedScale, {
  //           toValue: 1.1,
  //           duration: 500,
  //           easing: Easing.linear,
  //           useNativeDriver: true,
  //         }),
  //         Animated.timing(animatedScale, {
  //           toValue: 1,
  //           duration: 500,
  //           easing: Easing.linear,
  //           useNativeDriver: true,
  //         }),
  //       ]),
  //     ).start();
  //   };
  //   animateSocialIcons();
  // }, [animatedScale]);

  const handleMenuPress = () => {
    setMenuVisible(true);
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
  };

  const handleMenuItemPress = (screen: string) => {
    router.push(screen); // Use router.push directly
    handleCloseMenu();
  };

  const handleSocialPress = (url: string) => {
    window.open(url, '_blank'); // Use window.open for web
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: backgroundColor }}> {/* Equivalent to View */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, paddingTop: 40, borderBottomWidth: 0.5 }}> {/* headerContainer */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}> {/* headerLeft */}
            <Image
              src="/logo.png" // Path relative to public directory
              alt="SundarJobs Logo"
              width={40}
              height={40}
              style={{ borderRadius: '50%', marginRight: 10 }}
            />
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: textColor }}>SundarJobs</span>
          </div>
          <button onClick={handleMenuPress}>
            <Menu size={30} color={textColor} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10 }}> {/* socialGroupsContainer */}
          <span style={{ fontSize: '16px', fontWeight: 'bold', marginRight: 10, color: textColor }}>Join Our Groups</span>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}> {/* socialIconsContainer */}
            <div> {/* No animation for now */}
              <button onClick={() => handleSocialPress('https://chat.whatsapp.com/your-whatsapp-group-link')}>
                <MessageCircle size={30} color="#25D366" style={{ marginLeft: 10, marginRight: 10 }} /> {/* Using MessageCircle as WhatsApp placeholder */}
              </button>
            </div>
            <div>
              <button onClick={() => handleSocialPress('https://www.facebook.com/your-facebook-group-link')}>
                <Facebook size={30} color="#1877F2" style={{ marginLeft: 10, marginRight: 10 }} />
              </button>
            </div>
            <div>
              <button onClick={() => handleSocialPress('https://www.instagram.com/your-instagram-page-link')}>
                <Instagram size={30} color="#E4405F" style={{ marginLeft: 10, marginRight: 10 }} />
              </button>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderBottomWidth: 0.5 }}> {/* appDownloadContainer */}
          <span style={{ fontSize: '16px', fontWeight: 'bold', marginRight: 10, color: textColor }}>Download Our App</span>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}> {/* appIconsContainer */}
            <button onClick={() => handleSocialPress('https://play.google.com/store/apps/details?id=your.android.app.id')}>
              <Smartphone size={30} color="#3DDC84" style={{ marginLeft: 10, marginRight: 10 }} />
            </button>
            <button onClick={() => handleSocialPress('https://apps.apple.com/us/app/your-ios-app-id/id1234567890')}>
              <Monitor size={30} color="#000000" style={{ marginLeft: 10, marginRight: 10 }} />
            </button>
          </div>
        </div>
      </div>
      <div style={{flex: 1}}> {/* Main content area */}
        {children}
      </div>
      <FullScreenMenu isVisible={isMenuVisible} onClose={handleCloseMenu} onMenuItemPress={handleMenuItemPress} />
    </>
  );
}
