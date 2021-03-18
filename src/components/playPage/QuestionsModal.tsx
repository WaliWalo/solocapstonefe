import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { IQuestion, IQuestionsModalProp } from "./types";
import { fetchQuestions } from "../../utils/api";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { socket } from "../../utils/socket";

export default function QuestionsModal(props: IQuestionsModalProp) {
  const [questions, setQuestions] = useState<Array<IQuestion>>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  useEffect(() => {
    if (props.selection !== "") {
      getQuestions(props.selection);
    }
  }, [props.selection]);

  const getQuestions = async (selection: string) => {
    const res = await fetchQuestions();
    if (res !== undefined && res.ok) {
      const data = await res.json();
      const filterQuestions = data.filter(
        (question: IQuestion) => question.questionType === selection
      );
      const shuffled = filterQuestions.sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
    }
  };

  const handleSubmit = () => {
    props.onHide();
    socket &&
      socket.emit("onQuestionSelect", {
        question: selectedQuestion,
        userId: props.userId,
        roomName: props.roomName,
      });
  };

  return (
    <div>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title>{props.selection.toUpperCase()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Autocomplete
            id="combo-box-demo"
            options={questions}
            getOptionLabel={(option) => option.content}
            style={{ width: "100%" }}
            inputValue={selectedQuestion}
            onInputChange={(event, newInputValue) =>
              setSelectedQuestion(newInputValue)
            }
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                label={props.selection.toUpperCase()}
                variant="outlined"
              />
            )}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSubmit}>
            Select {props.selection}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
