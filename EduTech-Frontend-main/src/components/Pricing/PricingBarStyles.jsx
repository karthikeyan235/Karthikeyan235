import styled from 'styled-components';

// Primary Color Palette
const primaryColor = '#007BFF'; // Blue
const secondaryColor = 'black'; // Black
const backgroundColor = '#F8F9FA'; // Light Grey
const cardBackground = '#FFFFFF'; // White
const cardBorderColor = '#E0E0E0';
const hoverShadowColor = 'rgba(0, 123, 255, 0.3)';

// Container Styles
export const Container = styled.div`
    margin: 30px auto;
    max-width: 1200px;
    padding: 20px;
`;

// Title Styles
export const Title = styled.h2`
    text-align: center;
    margin-bottom: 30px;
    font-size: 2.2em;
    font-weight: bold;
    color: ${primaryColor};
    background: black;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

// Cards Container Styles
export const CardsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
`;

// Card Styles
export const Card = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 240px;
    padding: 20px;
    background-color: ${cardBackground};
    border: 1px solid ${cardBorderColor};
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    text-align: center;
    transition: all 0.3s ease-in-out;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px ${hoverShadowColor};
    }
`;

// Card Image Styles
export const CardImage = styled.img`
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background-color: ${secondaryColor};
    padding: 5px;
`;

// Card Content Styles
export const CardContent = styled.div`
    width: 100%;
    text-align: center;
    margin-top: 15px;
`;

// Slider Styles
export const Slider = styled.input`
    width: 100%;
`;

// Slider Container Styles
export const SliderContainer = styled.div`
    margin-top: 15px;
    width: 100%;
    text-align: center;

    .button-group {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
    }
`;

// Button Styles for + and - buttons
export const IncrementButton = styled.button`
    background-color: ${primaryColor};
    color: white;
    border: none;
    border-radius: 5px;
    width: 30px;
    height: 30px;
    font-size: 1.2em;
    margin: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3;
    }
`;

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
`;

export const DecrementButton = styled(IncrementButton)`
    background-color: ${secondaryColor};

    &:hover {
        background-color: #333;
    }
`;

// Total Details Styles
export const TotalDetails = styled.div`
    font-size: 1.3em;
    font-weight: bold;
    text-align: center;
    color: ${primaryColor};
    margin-top: 25px;
    background-color: ${cardBackground};
    padding: 15px;
    border-radius: 12px;
    border: 1px solid ${cardBorderColor};
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease-in-out;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px ${hoverShadowColor};
    }

    h3 {
        margin-bottom: 20px;
        font-size: 1.6em;
        color: ${secondaryColor}; /* Dark color for better readability */
        text-transform: uppercase;
        letter-spacing: 1.5px;
        background: linear-gradient(45deg, ${primaryColor}, ${secondaryColor});
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .price-info {
        display: flex;
        justify-content: space-between;
        font-size: 1.1em;
        padding: 10px 0;
        border-bottom: 1px solid ${cardBorderColor};

        &:last-child {
            border-bottom: none;
        }

        .label {
            font-weight: normal;
            color: ${secondaryColor};
        }

        .value {
            font-weight: bold;
            color: ${primaryColor};
        }

        &.total {
            font-size: 1.4em;
            color: #dc3545; /* Red color for emphasis on the total price */
            padding-top: 15px;
            border-top: 2px solid ${primaryColor};
        }
            
    }
`;