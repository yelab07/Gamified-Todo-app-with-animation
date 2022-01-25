import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { ref, update, remove, onValue, set } from "firebase/database";
import styles from "./styles";
import { Swipeable } from "react-native-gesture-handler";

const TaskItem = ({ item, db, userId }) => {
  const [toggleEdit, setToggleEdit] = useState(false);
  const [changeToDo, setChangeToDo] = useState("");
  const [pointGiven, setPointGiven] = useState(false);
  const [currScore, setCurrScore] = useState(null);
  const toDoListRef = ref(db, "toDoList/" + userId);
  const userPointsRef = ref(db, "profiles/" + userId);
  //curly braces when object - item is flat list
  // passing in props item - deconstructed

  console.log("Todoitems===>", item);
  //console.log(item);

  useEffect(() => {
    onValue(
      userPointsRef,
      (snapshot) => {
        if (snapshot.val() !== null) {
          const currScore = snapshot.val().currentScore;
          setCurrScore(currScore);
        }
      }
      //{ onlyOnce: true }
    );
  }, []);

  const handleEdit = (todo, id) => {
    if (toggleEdit) {
      if (changeToDo !== "") {
        updateData(changeToDo, id);

        setToggleEdit(!toggleEdit);
      }
    } else {
      setChangeToDo(todo);

      setToggleEdit(!toggleEdit);
    }
  };
  //handling toggle of editing. Passing in new todo + id of task we want to target

  const updateData = (toDo, id) => {
    const UpdateToDoRef = ref(db, "toDoList/" + userId + "/" + id);

    update(UpdateToDoRef, {
      todo: toDo,
    });
  };
  //updating of data in db. id = specific task id we're ref
  // forward slash to create path when connecting one generated key to another
  // update point to this part and update todo

  const deleteData = (id) => {
    const UpdateToDoRef = ref(db, "toDoList/" + userId + "/" + id);

    remove(UpdateToDoRef);
  };

  const completeTask = (id) => {
    const completeTaskRef = ref(db, "toDoList/" + userId + "/" + id);
    update(completeTaskRef, {
      complete: true,
      pointGiven: true,
    });

    if (!item.pointGiven) {
      if (currScore === null) {
        set(userPointsRef, { currentScore: 1 });
      } else {
        update(userPointsRef, { currentScore: currScore + 1 });
      }
    }

    //setTotalPoints(totalPoints + 1);
  };

  const LeftAction = () => (
    <View style={styles.leftAction}>
      <Text style={styles.textAction}>Completed</Text>
    </View>
  );

  return (
    <View style={styles.listItem}>
      <Swipeable
        renderLeftActions={LeftAction}
        onSwipeableLeftOpen={() => console.log("Swiping From the Left")}
      >
        {toggleEdit ? (
          <TextInput value={changeToDo} onChangeText={setChangeToDo} />
        ) : (
          <Text
            style={{
              textDecorationLine: item.complete ? "line-through" : "none",
            }}
          >
            {item.todo}
          </Text>
        )}
        <Pressable onPress={() => handleEdit(item.todo, item.id)}>
          <Text>{toggleEdit ? "✅" : "🖋️"}</Text>
        </Pressable>
        <Pressable onPress={() => deleteData(item.id)}>
          <Text>🗑️</Text>
        </Pressable>
        <Pressable onPress={() => completeTask(item.id, item.todo)}>
          <Text>DONE❤️</Text>
        </Pressable>
      </Swipeable>
    </View>
  );
};
//anonymous function binds to the component and doesn't execute until pressed

export default TaskItem;
