import React from 'react';
import styles from './SøknadLayout.module.css';

interface SøknadLayoutProps {
    children: React.ReactNode;
}

export default function SøknadLayout({ children }: SøknadLayoutProps) {
    return <div className={styles.søknadLayout}>{children}</div>;
}
