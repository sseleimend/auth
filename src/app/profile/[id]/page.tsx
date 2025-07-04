type Params = Promise<{ id: string }>;

export default async function Profile({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>
        User{" "}
        <span className="p-2 ml-2 rounded bg-orange-500 text-black">{id}</span>
      </h1>
    </div>
  );
}
