import $ from "../../theme/tokens";

const Pill = ({children,color=$.ac,bg:bgc}) => (
  <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:20,background:bgc||`${color}18`,color,whiteSpace:"nowrap"}}>{children}</span>
);

export default Pill;
