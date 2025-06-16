import React from "react";
import styled from "styled-components";
import linked from "../assets/Linked.png";
import gmail from "../assets/Gmail.png";
import git from "../assets/Git.png";

const Card = styled.div`
  width: 100%;
  max-width: 250px;
  height: 380px;
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
  text-align: center;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 0 50px 4px rgba(0, 0, 0, 0.5);
    filter: brightness(1.1);
  }

  ${({ theme }) =>
    theme.mode === "dark" &&
    `
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(255, 255, 255, 0.1);
  `}
`;

const ProfileImage = styled.img`
  width: 220px;
  height: 220px;
  border-radius: 15px;
  object-fit: cover;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 15px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 15px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 40px;
  margin-top: auto;
`;

const SocialButton = styled.a`
  font-size: 24px;
  color: ${({ color }) => color};
  transition: 0.3s;
  text-decoration: none;

  &:hover {
    opacity: 0.7;
  }
`;

const ProfileCard = ({ profile }) => {
  return (
    <Card>
      <ProfileImage src={profile.image} alt={profile.name} />
      <Title>{profile.name}</Title>
      <Subtitle>{profile.role}</Subtitle>
      <SocialLinks>
      <SocialButton href={profile.linkedin} target="_blank">
          <img src={linked} alt="LinkedIn" />
        </SocialButton>
        <SocialButton href={`mailto:${profile.email}`}>
          <img src={gmail} alt="Email" />
        </SocialButton>
        <SocialButton href={profile.github} target="_blank">
          <img src={git} alt="GitHub" />
        </SocialButton>
      </SocialLinks>
    </Card>
  );
};

export default ProfileCard;
