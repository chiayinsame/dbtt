import $ from "../../theme/tokens";

const Card = ({children,style:s,onClick:oc}) => (
  <div onClick={oc} style={{background:$.surf,borderRadius:$.r,border:`1px solid ${$.bd}`,padding:16,...s}}>{children}</div>
);

export default Card;
