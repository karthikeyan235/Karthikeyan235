import NothingSelectedImage from '../assets/NothingSelected.png';
import { useTranslation } from 'react-i18next';

const NothingSelected = ({text}) => {
    
const { i18n,t } = useTranslation();
    return (
        <div className="flex mt-3 flex-col w-full justify-center items-center">
            <img className="rounded-lg" src={NothingSelectedImage} width="250px" alt={t('noresourcefound')} />
            { text ? <p className="font-semibold mt-3">{text}</p> : null }
        </div>
    )
}

export default NothingSelected;