import React, { useContext, useState } from 'react';
import { Container, Title, CardsContainer, Card, SliderContainer, Slider, CardImage, CardContent, TotalDetails, IncrementButton, DecrementButton } from './PricingBarStyles';
import Users from '../../assets/Users.gif';
import Pages from '../../assets/Pages.gif';
import Questions from '../../assets/Questions.gif';
import Feedback from '../../assets/Feedback.gif';
import Collapse from 'react-bootstrap/Collapse';
import { IoMdArrowDropdown } from "react-icons/io";
import { PricingContext } from '../../contexts/PricingContext';
import { useTranslation } from 'react-i18next';

// Define constants
let PRICE_PER_USER = 1;
const PRICE_PER_Page = 0.0015;
const PRICE_PER_question = 0.00512;
const PRICE_Feedback_test = 0.092;
const MAX_PAGES = 5000000;
const MAX_QUESTIONS = 5000000;
const MAX_FEEDBACKS = 5000000;

const PricingBar = () => {
    const [numUsers, setNumUsers] = useState(0);
    const [numPages, setNumPages] = useState(300);
    const [numQuestions, setNumQuestions] = useState(160);
    const [numFeedbacks, setNumFeedbacks] = useState(8);
    const { isOpen, setIsOpen } = useContext(PricingContext);

    // Calculate total price
    const calculateTotalPrice = () => {
        const per_page = numPages * PRICE_PER_Page;
        const per_ques = numQuestions * PRICE_PER_question;
        const per_test = numFeedbacks * PRICE_Feedback_test;

        let total = per_page + per_ques + per_test;

        if(numUsers != 0){
            PRICE_PER_USER = (total / numUsers).toFixed(2);
        }
        else{
            PRICE_PER_USER = total.toFixed(2);
        }
        
        return total.toFixed(2);
    };

    // Handle slider change
    const handleSliderChange = (setter, step, maxValue) => (event) => {
        const value = parseInt(event.target.value, 10) * step;
        setter(Math.min(maxValue, value));
    };

    // Handle increment
    const handleIncrement = (setter, value, step, maxValue) => () => {
        setter(Math.min(maxValue, value + step));
    };

    // Handle decrement
    const handleDecrement = (setter, value, step, minValue) => () => {
        setter(Math.max(minValue, value - step));
    };

    // Extract prices
    const { total, pricePerUser } = calculateTotalPrice();
    const { i18n,t } = useTranslation();

    return (
        <div className='mt-[550px] md:mt-[400px] lg:mt-56 '>
            <button
                onClick={() => setIsOpen(!isOpen)}
                id="pricing"
                className='form-control font-semibold text-3xl flex justify-center py-4 items-center gap-x-4'
                aria-expanded={isOpen}
            >
                {t('pricing')} <IoMdArrowDropdown className={`${isOpen ? 'rotate-180' : ''} text-white duration-500 ease-out border p-1 bg-black/80 rounded-3xl text-4xl`} />
            </button>
            <Collapse in={isOpen}>
                <Container>
                    <Title>{t('pricingoverview')}</Title>
                    <CardsContainer>
                        {/* Card 1: Number of Users */}
                        <Card>
                            <CardImage src={Users} alt="Users" />
                            <CardContent>
                                <h3>{t('nou')}</h3>
                                <SliderContainer>
                                    <Slider
                                        type="range"
                                        min="0"
                                        max="400" // Slider corresponds to 10,000 users (400 * 25)
                                        value={Math.ceil(numUsers / 25)}
                                        onChange={handleSliderChange(setNumUsers, 25, 10000)}
                                    />
                                    <div>{numUsers === 0 ? 1 : numUsers} users</div> {/* Display 1 if numUsers is 0 */}
                                </SliderContainer>
                                {/* Increment / Decrement Buttons */}
                                <div className="button-group">
                                    <DecrementButton onClick={handleDecrement(setNumUsers, numUsers, 25, 0)}>−</DecrementButton>
                                    <IncrementButton onClick={handleIncrement(setNumUsers, numUsers, 25, 10000)}>+</IncrementButton>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 2: Number of Pages */}
                        <Card>
                            <CardImage src={Pages} alt="Pages" />
                            <CardContent>
                                <h3>{t('nop')}</h3>
                                <SliderContainer>
                                    <Slider
                                        type="range"
                                        min="0"
                                        max="50" // Slider corresponds to 15,000 pages (50 * 300)
                                        value={Math.ceil(numPages / 300)}
                                        onChange={handleSliderChange(setNumPages, 300, MAX_PAGES)}
                                    />
                                    <div>{numPages} {t('pages')}</div>
                                </SliderContainer>
                                {/* Increment / Decrement Buttons */}
                                <div className="button-group">
                                    <DecrementButton onClick={handleDecrement(setNumPages, numPages, 300, 0)}>−</DecrementButton>
                                    <IncrementButton onClick={handleIncrement(setNumPages, numPages, 300, MAX_PAGES)}>+</IncrementButton>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 3: Number of Questions */}
                        <Card>
                            <CardImage src={Questions} alt="Questions" />
                            <CardContent>
                                <h3>{t('noq')}</h3>
                                <SliderContainer>
                                    <Slider
                                        type="range"
                                        min="0"
                                        max="50" // Slider corresponds to 5,000 questions (50 * 100)
                                        value={Math.ceil(numQuestions / 100)}
                                        onChange={handleSliderChange(setNumQuestions, 100, MAX_QUESTIONS)}
                                    />
                                    <div>{numQuestions} {t('questions')}</div>
                                </SliderContainer>
                                {/* Increment / Decrement Buttons */}
                                <div className="button-group">
                                    <DecrementButton onClick={handleDecrement(setNumQuestions, numQuestions, 100, 0)}>−</DecrementButton>
                                    <IncrementButton onClick={handleIncrement(setNumQuestions, numQuestions, 100, MAX_QUESTIONS)}>+</IncrementButton>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 4: Test/Feedback */}
                        <Card>
                            <CardImage src={Feedback} alt="Feedback" />
                            <CardContent>
                                <h3>{t('t/f')}</h3>
                                <SliderContainer>
                                    <Slider
                                        type="range"
                                        min="0"
                                        max="50" // Slider corresponds to 500 Test/feedbacks (50 * 10)
                                        value={Math.ceil(numFeedbacks / 10)}
                                        onChange={handleSliderChange(setNumFeedbacks, 10, MAX_FEEDBACKS)}
                                    />
                                    <div>{numFeedbacks} {t('t/fs')}</div>
                                </SliderContainer>
                                {/* Increment / Decrement Buttons */}
                                <div className="button-group">
                                    <DecrementButton onClick={handleDecrement(setNumFeedbacks, numFeedbacks, 10, 0)}>−</DecrementButton>
                                    <IncrementButton onClick={handleIncrement(setNumFeedbacks, numFeedbacks, 10, MAX_FEEDBACKS)}>+</IncrementButton>
                                </div>
                            </CardContent>
                        </Card>
                    </CardsContainer>

                    {/* Total Price Calculation */}

                    {/* Total Price Calculation */}
                    <TotalDetails>
                        <div className="price-info">
                            <span className="label">{t('ppu')}</span>
                            <span className="value">${PRICE_PER_USER}</span>
                        </div>
                        <div className="price-info">
                            <span className="label">{t('totalusers')}</span>
                            <span className="value">{numUsers === 0 ? 1 : numUsers}</span>
                        </div>
                        <div className="price-info total">
                            <span className="label">{t('totalprice')}</span>
                            <span className="value">${calculateTotalPrice()}</span>
                        </div>
                    </TotalDetails>
                </Container>
            </Collapse>
        </div>
    );
};

export default PricingBar;