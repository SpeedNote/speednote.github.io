import {firebaseConfig} from "./firebase";
import {ref,onUnmounted} from 'vue';
import {onSnapshot, collection, doc, deleteDoc, setDoc, addDoc, orderBy, query} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default {
  data:()=> {
    return {
      messages:ref([]),
      isEditing: false,
    }
  },
  methods: {
    addNewMessage:function() {
      addDoc(collection(db,'messages'),{
        text:this.$refs.newmessage.value,
        date:Date.now(),
      });  
      this.$refs.newmessage.value = ""
    },
    startEditing() {
      this.isEditing = true;
    },
    updateMessage:function(message) {
      this.isEditing = false;
      setDoc(doc(db, 'messages', message.id),{
        text:message.text,
        date:message.date
      })
    },
    deleteMessage:function(id) {
      deleteDoc(doc(db, 'messages', id))
    },
    setMessageFocus(message, isFocused) {
      message.isFocused = isFocused;
    },
    isMessageFocused(message) {
      return message.isFocused;
    },
  },
  mounted() {
    const latestQuery = query(collection(db, "messages"),orderBy('date'));
    const livemessages = onSnapshot(latestQuery,(snapshot)=>{
      this.messages = snapshot.docs.map((doc) => {
        return {
          id:doc.id,
          text:doc.data().text,
          date:doc.data().date
        }
      });
    });
    onUnmounted(livemessages)
  }
}