import Image from "next/image";

export default function SafeImage  (props: any){
  if (!props.src) {
    console.warn("⚠️ Empty image src detected!", props);
    return null;
  }
  return <Image {...props} />;
};
