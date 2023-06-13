import React from 'react';
import styles from './../søknad-layout/SøknadLayout.module.css';
import TitleBanner from '@/components/title-banner/TitleBanner';

interface BannerLayoutProps {
    children: React.ReactNode;
}

export default function BannerLayout({ children }: BannerLayoutProps) {
    return (
        <>
            <TitleBanner />
            <div className={styles.søknadLayout}>{children}</div>
        </>
    );
}
