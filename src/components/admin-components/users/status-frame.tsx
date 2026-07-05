import Image, { StaticImageData } from "next/image";


type props = {
  title: string;
  quantity: number;
  width: number
  height: number
  icon: string | StaticImageData;
};

export default function StatusFrame({ title, quantity, icon, width, height }: props) {
  return (
    <div className="w-full h-28 flex flex-col justify-center items-start">
      <p className="text-c12 font-MontserratNormal text-000000/68 mb-2">{title}</p>
      <div className="flex items-center gap-3">
        <p className="text-c32 font-MontserratMedium">{quantity}</p>
        <div className="h-c32  w-c32 flex items-center justify-center shrink-0">
            <Image src={icon} alt={title} width={width} height={height} />
        </div>
       
      </div>
    </div>
  );
}
