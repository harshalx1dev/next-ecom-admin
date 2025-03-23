interface HeadingProps {
  title: string;
  description: string
}

export const Heading = ({ title, description }: HeadingProps) => {
  return (
    <div>
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="text-sm">{description}</p>
    </div>
  )
}