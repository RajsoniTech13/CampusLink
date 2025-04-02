export const GroupChats = {
    1: {
      id: 1,
      name: "Web Dev Team",
      members: [
        { username: "Rajkumar", profilePicture: "/assets/Person/1.jpeg" },
        { username: "Lucky", profilePicture: "/assets/Person/2.jpeg" },
        { username: "Deepak", profilePicture: "/assets/Person/3.jpeg" }
      ],
      messages: [
        {
          sender: "Rajkumar",
          senderProfile: "/assets/Person/1.jpeg",
          text: "Hey team, did you check the latest React update?",
          time: "10:30 AM"
        },
        {
          sender: "Lucky",
          senderProfile: "/assets/Person/2.jpeg",
          text: "Yes, Hooks have some great new features!",
          time: "10:35 AM"
        },
        {
          sender: "Deepak",
          senderProfile: "/assets/Person/3.jpeg",
          text: "I will check it out later. Is it stable?",
          time: "10:40 AM"
        },
        {
          sender: "me",
          senderProfile: "/assets/Person/4.jpeg",
          text: "Yes, it's stable. We can update our project.",
          time: "10:42 AM"
        }
      ]
    },
  
    2: {
      id: 2,
      name: "College Friends",
      members: [
        { username: "Amit", profilePicture: "/assets/Person/5.jpeg" },
        { username: "Priya", profilePicture: "/assets/Person/6.jpeg" },
        { username: "Rahul", profilePicture: "/assets/Person/7.jpeg" }
      ],
      messages: [
        {
          sender: "Amit",
          senderProfile: "/assets/Person/5.jpeg",
          text: "Guys, when are we meeting for the project discussion?",
          time: "2:00 PM"
        },
        {
          sender: "Priya",
          senderProfile: "/assets/Person/6.jpeg",
          text: "How about tomorrow at 5 PM?",
          time: "2:05 PM"
        },
        {
          sender: "me",
          senderProfile: "/assets/Person/4.jpeg",
          text: "Tomorrow sounds good!",
          time: "2:10 PM"
        }
      ]
    },
  
    3: {
      id: 3,
      name: "Blockchain Hackathon",
      members: [
        { username: "Sanjay", profilePicture: "/assets/Person/8.jpeg" },
        { username: "Neha", profilePicture: "/assets/Person/9.jpeg" },
        { username: "Vikas", profilePicture: "/assets/Person/10.jpeg" }
      ],
      messages: [
        {
          sender: "Sanjay",
          senderProfile: "/assets/Person/8.jpeg",
          text: "We need to finalize our smart contract before submission.",
          time: "5:30 PM"
        },
        {
          sender: "Sanjay",
          senderProfile: "/assets/Person/8.jpeg",
          text: "We need to finalize our smart contract before submission.",
          time: "5:30 PM"
        },
        {
          sender: "Neha",
          senderProfile: "/assets/Person/9.jpeg",
          text: "Yes, I'm testing the contract now.",
          time: "5:35 PM"
        },
        {
          sender: "me",
          senderProfile: "/assets/Person/4.jpeg",
          text: "I'll integrate it with our React frontend tonight.",
          time: "5:45 PM"
        }
      ]
    }
  };
  