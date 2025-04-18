import searchlogo from "../assets/search.svg";

interface SearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Search = ({ searchTerm, setSearchTerm }: SearchProps) => {
  return (
    <div className='search'>
      <div> 
        <img src={searchlogo} alt="search" />
        <input 
          type='text'
          placeholder='Search through movies'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;