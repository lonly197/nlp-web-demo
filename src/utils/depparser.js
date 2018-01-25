//入口程序
export default function GDepParser(node_list) {
  //def common info
  const svg_info = { width: 0, height: 0 }; //整个框架的信息
  const node_info = {
    node_list,
    word_height: 40,
    zh_word_width: 16, //一个中文汉字的宽度
    arrow_width: 10,
    word_left_space: 20, //每个词之间的空
    edge_height: 45, //边之间的高度
    svg_min_width: 500, //最小宽度
    svg_top_margin: 10,
    svg_left_margin: 10,
    one_lable_width: 16, //一个lable的横向宽度
    one_lable_height: 18, //lable标签的高度
    word_top_margin: 5 //词部分上面预留
  };

  //TODO 获得root节点
  let root = -1;
  for (let node of node_list) {
    // console.log("node", node);
    if (node["id"] == node["fid"]) {
      root = node["id"];
      break;
    }
  }
  if (root == -1) {
    print("Not find root.");
    return;
  }
  //TODO 计算每个节点的入边条数
  node_info.word_input_edge_nums = get_input_edge_info(node_info.node_list);
  // console.log("word_input_edge_nums", node_info.word_input_edge_nums);

  //TODO 计算每一个节点的宽高信息
  node_info.word_width_height_info = get_width_height_info(node_info);

  //TODO 填充邻接表 fid->cid_list
  node_info.cid_list = get_cid_list(node_info.node_list);

  //TODO 计算每个节点边交叉个数,为后面计算边的高度准备数据
  node_info.edge_cross_deep = get_edge_cross_deep(node_info.node_list);
  // console.log("edge_cross_deep:", node_info.edge_cross_deep);

  //TODO 得到最大深度
  node_info.edge_max_deep = get_edge_max_deep(node_info.edge_cross_deep);

  //TODO 计算svg的宽高
  node_info.svg_attr = get_svg_attr(node_info);

  //TODO 计算每一个节点的左上坐标
  node_info.words_translate = get_words_translate(node_info);
  // console.log("words_translate", node_info.words_translate);

  //TODO 计算每一个边的四个点,从左下到右下
  node_info.edge_path = get_edge_path(node_info);
  // console.log(node_info.edge_path);

  //TODO 计算edge上面每一个Lable的位置和长宽
  node_info.edge_label_info = get_edge_lable_info(node_info);
  // console.log("edge_label_info", node_info.edge_label_info);

  //TODO 生成html代码
  // node_info.html = get_html(node_info);

  //    console.log(node_info)

  return get_html(node_info);
}

function get_html(node_info) {
  const html = "";
  //TODO 生成父子结构对应的html代码
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  //var node_html = document.createElement("g")
  //var edge_html = document.createElement("g")
  //svg.appendChild(node_html)
  //svg.appendChild(edge_html)

  //TODO 配置svg属性

  const viewBox = `0,0,${node_info.svg_attr.width},${node_info.svg_attr.height}`;
  svg.setAttribute("viewBox", viewBox);
  svg.setAttribute("width", node_info.svg_attr.width);
  svg.setAttribute("height", node_info.svg_attr.height);
  svg.setAttributeNS(
    "http://www.w3.org/2000/xmlns/",
    "xmlns:xlink",
    "http://www.w3.org/1999/xlink"
  );
  svg.setAttribute("version", "1.1");

  //TODO 生成node代码

  for (var i = 0; i < node_info.words_translate.length; i++) {
    const g = document.createElementNS(NS, "g");
    svg.appendChild(g);
    const width = node_info.word_width_height_info[i].width;
    const height = node_info.word_width_height_info[i].height;
    g.setAttribute("width", width);
    g.setAttribute("height", height);
    const translate = `translate(${node_info.words_translate[i].x},${
      node_info.words_translate[i].y
    })`;
    g.setAttribute("transform", translate);

    //rect
    const rect = document.createElementNS(NS, "rect");
    rect.style = "stroke-width: 3; opacity: 0.5; stroke: #333;";
    rect.style.height = height;
    rect.style.width = width;
    g.appendChild(rect);

    //g-text
    const text = document.createElementNS(NS, "g");
    text.setAttribute("transform", "translate(0,12)");
    g.appendChild(text);
    //rect2
    const rect2 = document.createElementNS(NS, "rect");
    rect2.style = "fill: #fff;";
    rect2.style.width = width;
    rect2.style.height = height;
    rect2.setAttribute("x", 0);
    rect2.setAttribute("y", -12);
    text.appendChild(rect2);

    //word_top
    const word_top = document.createElementNS(NS, "text");
    text.appendChild(word_top);
    const tspan = document.createElementNS(NS, "tspan");

    word_top.appendChild(tspan);
    tspan.textContent = node_info.node_list[i].word;
    const word_tspan_dx =
      node_info.word_width_height_info[i].width / 2.0 -
      node_info.zh_word_width * node_info.node_list[i].word.length / 2.0;
    tspan.setAttribute("dx", word_tspan_dx);
    tspan.setAttribute("dy", node_info.word_top_margin);

    //post bottom
    const post_text = document.createElementNS(NS, "text");
    text.appendChild(post_text);
    const post_tspan = document.createElementNS(NS, "tspan");
    post_text.appendChild(post_tspan);

    const post_tspan_text = `${i}|${node_info.node_list[i].post}`;
    const post_tspan_dx =
      node_info.word_width_height_info[i].width / 2.0 -
      (node_info.one_lable_width - 6 ) * post_tspan_text.length / 2.0;
    post_tspan.setAttribute("dx", post_tspan_dx);
    post_tspan.setAttribute(
      "dy",
      node_info.word_width_height_info[i].height / 2.0
    );
    post_tspan.setAttribute("fill", "#999");
    post_tspan.textContent = post_tspan_text;
  }
  //TODO 生成边的代码

  //定义箭头
  const defs = document.createElementNS(NS, "defs");
  svg.appendChild(defs);

  const marker = document.createElementNS(NS, "marker");
  defs.appendChild(marker);
  marker.id = "arrowhead";
  marker.setAttribute("viewBox", "0 0 10 10");
  marker.setAttribute("refX", 8);
  marker.setAttribute("refY", 5);
  marker.setAttribute("markerWidth", 8);
  marker.setAttribute("markerHeight", 5);
  marker.setAttribute("orient", "auto");
  marker.style = "fill:#999";
  const def_path = document.createElementNS(NS, "path");
  def_path.setAttribute("d", "M 0 0 L 7 5 L 0 10 z");
  marker.appendChild(def_path);
  //插入具体的边
  for (var i = 0; i < node_info.edge_cross_deep.length; i += 1) {
    if (i == node_info.node_list[i].fid) {
      continue;
    }

    const edge = document.createElementNS(NS, "g");
    svg.appendChild(edge);

    //path
    const path = document.createElementNS(NS, "path");
    edge.appendChild(path);

    let p_list = "";
    for (let p = 0; p < node_info.edge_path[i].length; p++) {
      let ch = "L";
      if (p == 0) ch = "M";

      p_list += `${ch + node_info.edge_path[i][p].x} ${
        node_info.edge_path[i][p].y
      }`;
    }
    p_list += "";
    path.setAttribute("marker-end", "url(#arrowhead)");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#999");
    path.setAttribute("stroke-width", 2);
    path.setAttribute("d", p_list);

    //lable
    const lable = document.createElementNS(NS, "g");
    edge.appendChild(lable);

    const translate = `translate(${node_info.edge_label_info[i].x},${
      node_info.edge_label_info[i].y
    })`;
    lable.setAttribute("transform", translate);

    const lable_rect = document.createElementNS(NS, "rect");
    lable.appendChild(lable_rect);
    lable_rect.setAttribute("width", node_info.edge_label_info[i].width);
    lable_rect.setAttribute("height", node_info.edge_label_info[i].height);
    lable_rect.setAttribute("fill", "#f6f6f6");
    lable_rect.setAttribute("y", -15);

    const lable_text = document.createElementNS(NS, "text");
    lable.appendChild(lable_text);
    lable_text.setAttribute("width", node_info.edge_label_info[i].width);
    lable_text.setAttribute("height", node_info.edge_label_info[i].height);

    const lable_text_tspan = document.createElementNS(NS, "tspan");
    lable_text.appendChild(lable_text_tspan);
    lable_text_tspan.textContent = node_info.node_list[i].dep_type;
    lable_text_tspan.setAttribute("width", node_info.edge_label_info[i].width);
    lable_text_tspan.setAttribute(
      "height",
      node_info.edge_label_info[i].height
    );
  }

  // console.log(svg);
  // document.body.appendChild(svg);

  return svg;
}

function get_edge_lable_info(node_info) {
  const edge_lable_info = [];
  for (let i = 0; i < node_info.edge_path.length; i++) {
    const lable = {};
    lable.width =
      node_info.node_list[i].dep_type.length * node_info.one_lable_width;
    lable.height = node_info.one_lable_height;
    lable.x =
      (node_info.edge_path[i][1].x + node_info.edge_path[i][2].x) / 2.0 -
      lable.width / 2.0;
    lable.y = node_info.edge_path[i][1].y + lable.height / 2.0;
    edge_lable_info[i] = lable;
    // console.log(`[get_edge_lable_info] one_lable_height ${node_info.one_lable_height}`);
  }
  return edge_lable_info;
}

function get_edge_path(node_info) {
  const edge_path = [];

  for (let i = 0; i < node_info.word_width_height_info.length; i++) {
    let bias = get_output_bias(i, node_info);
    let x =
      node_info.words_translate[i].x +
      node_info.word_width_height_info[i].width / 2.0;
    x += bias;
    const p1 = {
      x,
      y: node_info.words_translate[i].y
    };
    // console.log( `[get_edge_path] i:${i} edge_cross_deep ${node_info.edge_cross_deep[i]}`);
    const fid = node_info.node_list[i].fid;

    //var part_deep = get_cid_to_fid_part_deep(i, fid, node_info)
    const p2 = {
      x: p1.x,
      y:
        (node_info.edge_max_deep - node_info.edge_cross_deep[i]) *
          node_info.edge_height +
        node_info.svg_top_margin
    };

    let fmid =
      node_info.words_translate[fid].x +
      node_info.word_width_height_info[fid].width / 2.0;

    bias = get_arrow_bias(i, fid, node_info);
    fmid += bias;
    const p3 = {
      x: fmid,
      y: p2.y
    };

    const p4 = {
      x: p3.x,
      y: p1.y
    };
    edge_path[i] = [p1, p2, p3, p4];
  }

  return edge_path;
}
function get_cid_to_fid_part_deep(
  cid,
  fid,
  { edge_max_deep, edge_cross_deep }
) {
  const part_deep = edge_max_deep;
  d = 1;
  if (cid > fid) d = -1;
  for (let i = cid; i != fid; i += d) {
    if (part_deep > edge_cross_deep[i]) {
      max_deep = edge_cross_deep[i];
    }
  }
  return part_deep;
}

//计算每一个输出的偏移量
function get_output_bias(id, node_info) {
  let bias = 0;
  //TODO 获取位置 idx
  let idx = 0;
  const cid_list = node_info.cid_list[id];
  for (let i = 0; i < cid_list.length; i++) {
    if (cid_list[i] < id) {
      idx += 1;
    }
  }
  //TODO 根据位置计算偏移
  const width = node_info.word_width_height_info[id].width;
  const input_width = node_info.arrow_width * cid_list.length;

  const left_margin = (width - input_width) / 2.0;
  bias = left_margin + idx * node_info.arrow_width;

  bias -= width / 2.0;
  // console.log(`[get_output_bias] id:${id}`);
  // console.log(`[get_output_bias] idx ${idx} bias :${bias} width:${width} input_width:${input_width} cid ${cid_list}`);

  return bias;
}
//计算每一个箭头的偏移量
function get_arrow_bias(cid, fid, node_info) {
  let bias = 0;
  const cid_list = node_info.cid_list[fid];
  // console.log(`get arrow bias ${cid} ${fid} ${cid_list}`);

  //TODO 得到正确的位置编号
  let idx = 0;
  let left_num = 0;
  for (let i = 0; i < cid_list.length; i++) {
    if (cid_list[i] == cid) {
      idx = i;
    }
    if (cid_list[i] < fid) {
      left_num += 1;
    }
  }
  const right_num = cid_list.length - left_num;

  if (cid < fid) {
    idx = left_num - idx - 1; //修正左边的位置
  } else {
    idx = right_num - (idx - left_num) + left_num; //修正右边的位置
  }
  //TODO 开始计算bias
  const width = node_info.word_width_height_info[fid].width;
  let input_width = node_info.arrow_width * cid_list.length;
  if (fid == node_info.node_list[fid].fid) {
    input_width -= node_info.arrow_width; //如果是根节点就去掉他自身
  }

  const left_margin = (width - input_width) / 2.0;
  bias = left_margin + idx * node_info.arrow_width;

  bias -= width / 2.0;
  // console.log(`bias :${bias} width:${width} input_width:${input_width}`);
  return bias;
}

function get_words_translate(node_info) {
  const words_translate = [];
  let left_dis = node_info.svg_left_margin;
  let top_dis =
    node_info.svg_top_margin + node_info.edge_max_deep * node_info.edge_height;

  for (let i = 0; i < node_info.word_width_height_info.length; i++) {
    const x = left_dis;
    const y = top_dis;
    left_dis += node_info.word_width_height_info[i].width;
    left_dis += node_info.word_left_space;

    words_translate[i] = { x, y };
  }

  return words_translate;
}

function get_svg_attr(node_info) {
  const attr = {};

  let width = 0;
  let height = 0;
  for (let i = 0; i < node_info.word_width_height_info.length; i++) {
    width +=
      node_info.word_width_height_info[i].width + node_info.word_left_space;
  }

  height =
    node_info.word_height + node_info.edge_max_deep * node_info.edge_height;

  attr.width = width - node_info.word_left_space;
  attr.height = height;

  attr.width += node_info.svg_left_margin * 2;
  attr.height += node_info.svg_top_margin * 2;

  // console.log(attr);
  return attr;
}

//max deep
function get_edge_max_deep(edge_cross_deep) {
  let max = 0;
  for (let i = 0; i < edge_cross_deep.length; i++) {
    if (max < edge_cross_deep[i]) {
      max = edge_cross_deep[i];
    }
  }
  return max;
}
/*
*  deep[i] = 1 + max{ deep[j] }, j in i_cover_area
* */
//cross deep
function get_edge_cross_deep(node_list) {
  //初始化矩阵
  const cross_deep = [];
  for (let i = 0; i < node_list.length; i++) {
    cross_deep[i] = get_deep_by_id(i, node_list);
  }
  return cross_deep;
}

function get_deep_by_id(id, node_list) {
  const fid = node_list[id].fid;
  const ffid = node_list[fid].fid;
  // console.log(`-----> id${id} fid ${fid} ffid ${ffid}----`);
  if (id == fid) {
    return 0;
  }

  let d = 1;
  if (id > fid) {
    d = -1;
  }

  if (id + d == fid) {
    return 1;
  }

  let max_deep = 0;
  let deep = 0;
  for (let i = id + d; i != fid; i += d) {
    // console.log(i, fid, d);
    deep = get_deep_by_id(i, node_list);
    if (deep > max_deep) {
      max_deep = deep;
    }
    // console.log("next");
  }
  //处理最后一个节点特殊情况
  //if ( (fid - ffid) * (id - fid)  < 0) {
  //    deep = get_deep_by_id(fid, node_list)
  //}
  //if (deep > max_deep) { max_deep = deep ;}
  //console.log("max deep :" + max_deep)
  return max_deep + 1;
}

//cidlist
function get_cid_list(node_list) {
  const cid_list = [];
  for (var i = 0; i < node_list.length; i++) {
    //初始化内存
    cid_list[i] = [];
  }

  for (var i = 0; i < node_list.length; i++) {
    if (node_list[i].id == node_list[i].fid) {
      continue;
    }
    cid_list[node_list[i].fid].push(node_list[i].id);
  }
  // console.log(cid_list);
  return cid_list;
}
//填充宽高信息
function get_width_height_info(node_info) {
  const width_height_info = [];

  for (let i = 0; i < node_info.node_list.length; i++) {
    //width
    let width =
      node_info.zh_word_width * node_info.node_list[i].word.length * 1.15;
    const sum_arror_width =
      node_info.arrow_width * node_info.word_input_edge_nums[i];
    const post_text_width =
      node_info.one_lable_width *
      (node_info.node_list[i].post.length + 2) *
      1.3;

    if (width < sum_arror_width) {
      width = sum_arror_width;
    }
    if (width < post_text_width) width = post_text_width;
    //height
    const height =
      node_info.word_top_margin * 3 +
      node_info.zh_word_width +
      node_info.one_lable_height;
    width_height_info[i] = { width: width, height: height };
  }
  return width_height_info;
}

//获取入边条数信息
function get_input_edge_info(node_list) {
  const res = [];
  for (let i = 0; i < node_list.length; i++) {
    res[i] = 0;
  }

  for (let i = 0; i < node_list.length; i++) {
    const id = node_list[i].id;
    const fid = node_list[i].fid;
    if (id == fid) {
      continue;
    }
    res[fid] += 1;
  }
  return res;
}

// //--run ---
// const node_list = [
//       {"id":0, "fid":1, "word":"我", "post":"r", "dep_type":"SUB"},
//       {"id":1, "fid":1, "word":"爱", "post":"v", "dep_type":"FREE"},
//       {"id":2, "fid":3, "word":"北京","post":"ns", "dep_type":"XXX"},
//       {"id":3, "fid":1, "word":"天安门","post":"ns", "dep_type":"FREE"},
//       {"id":4, "fid":3, "word":"北京","post":"ns", "dep_type":"XXX"},

//   {"id":5, "fid":8, "word":"天安门","post":"ns", "dep_type":"FREE"},
//       {"id":6, "fid":7, "word":"天安门","post":"ns", "dep_type":"XXX"},
//   {"id":7, "fid":8, "word":"天安门","post":"ns", "dep_type":"XXX"},

//   {"id":8, "fid":1, "word":"中华人民共和国","post":"ns", "dep_type":"FREE"},
//   ];

// console.log(node_list)

// GDepParser(node_list)
