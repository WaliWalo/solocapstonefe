import { IUser } from "./types";

export const createUser = async (user: IUser) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getUsersByRoomId = async (roomId: string) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BE_URL}/users/${roomId}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getRoomByUserId = async (userId: string) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BE_URL}/rooms/${userId}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const fetchQuestions = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BE_URL}/questions`);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const fetchMessages = async (roomId: string) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BE_URL}/messages/${roomId}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
