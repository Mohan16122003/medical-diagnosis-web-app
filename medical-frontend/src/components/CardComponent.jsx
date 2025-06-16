import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Card = styled.div`
  width: 100%;
  max-width: 270px;
  height: 400px;
  background: ${({ theme }) => theme.card};
  backdrop-filter: blur(12px);
  border-radius: 15px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
  transition: all 0.4s ease-in-out;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 0 50px 4px rgba(0, 0, 0, 0.5);
    filter: brightness(1.1);
  }

  /* 🔹 Dark Mode Enhancements */
  ${({ theme }) =>
    theme.mode === "dark" &&
    `
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(255, 255, 255, 0.1);
  `}
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  text-align: center;
  position: absolute;
  bottom: 70px;
  width: 100%;
  padding: 10px;
  text-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
`;

const Button = styled.button`
  width: 60%;
  margin: 0 auto;
  padding: 12px;
  background: linear-gradient(135deg, #1e90ff, #2575fc);
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, #2575fc, #1e90ff);
  }

  &:active {
    transform: scale(0.95);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 280px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 16px 2px rgba(0, 0, 0, 0.3);
  object-fit: cover;
`;

const CardComponent = ({ project }) => {
  const navigate = useNavigate();
  const handleNavigation = (event) => { 
    event.stopPropagation();
    navigate(project.link);
  };
  return (
    <Card onClick={handleNavigation}>
      <Image src={project.image} alt={project.title} />
      <Title>{project.title}</Title>
      <Button onClick={(e) => handleNavigation(e)}>Diagnose</Button>
    </Card>
  );
};

export default CardComponent;
