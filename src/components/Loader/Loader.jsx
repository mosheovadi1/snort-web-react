import css from "./Loader.module.css";

const Loader = ({ isLoading, children }) => {
    if (isLoading){
        return  <div className={css["loader"]}><h1><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;is&nbsp;scanning...</h1></div>
    }
    else{
        return children;
    }
};

export default Loader;