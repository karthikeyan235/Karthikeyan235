import React from "react";
import cautionImage from '../assets/caution.png';
import { useTranslation } from 'react-i18next';

const styles = {
  
  container: {
    display: "flex",
    flexDirection: "column", 
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    color: "#721c24",
    fontFamily: "Arial, sans-serif",
    padding: "0 20px", 
    textAlign: "center", 
  },
  image: {
    width: "150px", 
    marginBottom: "20px", 
  },
};

const DeviceWarning = () => {
  
const { i18n,t } = useTranslation();
  return (
    <div style={styles.container}>
      {cautionImage && <img src={cautionImage} alt="Caution" style={styles.image} />}
      <h1 className="font-semibold">{t('yntboals')}</h1>
    </div>
  );
};

export default DeviceWarning;
