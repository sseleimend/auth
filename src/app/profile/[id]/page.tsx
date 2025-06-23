interface PageProps {
  params: {
    id: string;
  };
}

export default function Profile({ params }: PageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>
        User{" "}
        <span className="p-2 ml-2 rounded bg-orange-500 text-black">
          {params.id}
        </span>
      </h1>
    </div>
  );
}
