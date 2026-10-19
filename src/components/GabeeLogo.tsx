import React from 'react';

interface GabeeLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'gold' | 'light' | 'dark';
}

export const GabeeLogo: React.FC<GabeeLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'light',
}) => {
  const isDark = variant === 'dark';

  const sizeConfig = {
    sm: {
      imgClass: isDark ? 'h-9 w-9 object-contain' : 'h-11 w-11 object-contain mix-blend-multiply',
      badgeClass: isDark ? 'p-1 rounded-xl bg-[#FFFDF9] border border-[#D4AF37]/40 shadow-xs' : '',
      wrapperClass: 'gap-2',
    },
    md: {
      imgClass: isDark ? 'h-14 w-14 object-contain' : 'h-16 w-16 object-contain mix-blend-multiply',
      badgeClass: isDark ? 'p-1.5 rounded-2xl bg-[#FFFDF9] border border-[#D4AF37]/40 shadow-xs' : '',
      wrapperClass: 'gap-2.5',
    },
    lg: {
      imgClass: isDark
        ? 'w-44 h-44 sm:w-56 sm:h-56 object-contain'
        : 'w-48 h-48 sm:w-64 sm:h-64 object-contain mix-blend-multiply drop-shadow-md',
      badgeClass: isDark ? 'p-3 rounded-3xl bg-[#FFFDF9] border border-[#D4AF37]/50 shadow-md' : '',
      wrapperClass: 'gap-3',
    },
    xl: {
      imgClass: isDark
        ? 'w-60 h-60 sm:w-72 sm:h-72 object-contain'
        : 'w-64 h-64 sm:w-80 sm:h-80 object-contain mix-blend-multiply drop-shadow-lg',
      badgeClass: isDark ? 'p-4 rounded-3xl bg-[#FFFDF9] border border-[#D4AF37]/50 shadow-lg' : '',
      wrapperClass: 'gap-4',
    },
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeConfig.wrapperClass} ${className}`}>
      {/* Ambient golden aura for lg/xl presentation */}
      {(size === 'lg' || size === 'xl') && !isDark && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#DFBA68]/25 via-[#F2CFC7]/20 to-[#EAD6C9]/25 blur-2xl rounded-full -z-10 scale-110 pointer-events-none" />
      )}

      <div className={`transition-transform duration-300 hover:scale-105 ${sizeConfig.badgeClass}`}>
        <img
          src="/assets/aistudio/LogoGN_3D_60598508.jpg"
          alt="Gabee Nail Artist - Logo Oficial 3D"
          className={`${sizeConfig.imgClass} transition-transform duration-300`}
          loading="eager"
        />
      </div>
    </div>
  );
};
