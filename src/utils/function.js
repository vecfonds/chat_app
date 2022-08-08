export function infoFilter(item, _id) {
  const lastMessage = item.lastMessage?.text;
  const roomId = item._id;
  if (item.name) {
    //group
    const roomName = item.name;
    const roomAvatar = item.avatar;
    return { roomAvatar, roomName, lastMessage, roomId };
  } else {
    const memberFilter = item.members?.filter(
      (member) => member._id !== _id
    )[0];

    const roomName = memberFilter?.fullname;
    const roomAvatar = memberFilter?.avatar;
    return { roomAvatar, roomName, lastMessage, roomId };
  }
}
