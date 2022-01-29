function ShowcaseComponent({ styles, padded, children }) {
  return (
    <div className={`${styles} flex grow h-full ${padded && "py-32"} rounded`}>
      {children}
    </div>
  );
}

export default ShowcaseComponent;
