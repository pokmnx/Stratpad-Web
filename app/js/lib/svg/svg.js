define(['lib/svg/svg-2.3.2'],

	function() {

		SVG.extend(SVG.Container, {

			// http://us3.php.net/manual/en/function.wordwrap.php
			wordwrap: function(str, width, brk, cut) {
				// 3 lines max, width is the chars max

				brk = brk || '\n';
				width = width || 75;
				cut = cut || false;

				if (!str) {
					return str;
				}

				var regex = '.{1,' + width + '}(\\s|$)' + (cut ? '|.{' + width + '}|.+$' : '|\\S+?(\\s|$)');
				var lines = str.match(RegExp(regex, 'g'));
				lines = lines.slice(0, (Math.min(lines.length, 3)));
				_.each(lines, function(line, index) { lines[index] = line.trim(); } );
				return lines.join(brk);
			}

		});

		SVG.RowHeader = SVG.invent({
			create: 'text',
			inherit: SVG.Text,
			extend: {

			},
			construct: {
				rowHeader: function(rect, headingText, descriptionText) {
					var heading = this.put(new SVG.Text);
					var maxChars = Math.ceil(rect.width / 7.7);
					var wrappedText = this.wordwrap(headingText, maxChars, '\n', true);
					heading.text(wrappedText);
					heading.attr({
						'class': 'title'
					});
					heading.move(rect.x, rect.y);
					// this.put(heading);

					if (descriptionText) {
						var description = new SVG.Text();
						var maxChars = Math.ceil(rect.width / 7.7);
						wrappedText = this.wordwrap(descriptionText, maxChars, '\n', true);
						description.text(wrappedText);
						description.leading(0.9);
						this.put(description);
						description.move(rect.x, rect.y + 22);
					};
					return heading;
				}
			}
		});

		SVG.ArrowHead = SVG.invent({
			create: 'marker',
			inherit: SVG.Container,
			extend: {
				toString: function() {
		        return 'url(#' + this.attr('id') + ')'
		      }
			},
			construct: {
				// place arrowHead marker in defs
				initArrowHead: function() {
					var m = this.defs().put(new SVG.ArrowHead, 0);
					m.attr({
						orient: "auto",
						markerWidth: '6',
						markerHeight: '6',
						refX: '6',
						refY: '3'
					});
					var arrowHeadPath = this.path('M0,0 V6 L6,3 Z').fill('#333');
					m.add(arrowHeadPath);
					return m;
				}
			}
		});

		SVG.Bubble = SVG.invent({
			create: 'rect',
			inherit: SVG.Shape,
			extend: {
				arrow: function(toBubble) {
					var arrowHead = this.parent().defs().get(0);
					var line = new SVG.Line()
						.plot(this.cx(), this.cy() - 55 / 2, toBubble.cx(), toBubble.cy() + 55 / 2)
						.attr({
							stroke: '#333',
							'stroke-width': '1px',
							'marker-end': arrowHead.toString()
						});
					return this.parent().put(line);
				},

				// hack: so that we can apply to text automatically, which otherwise doesn't pass thru or bubble (probably because text is not a child of bubble)
			    on: function(event, listener) {
			      SVG.on(this.node, event, listener);
  			      SVG.on(this.text.node, event, listener);
			      
			      return this;
			    },
			  	off: function(event, listener) {
			      SVG.off(this.node, event, listener)
			      SVG.off(this.text.node, event, listener);

			      return this
			    }
			},
			construct: {
				bubble: function(rect, color, s) {
					var bubble = this.put(new SVG.Bubble).size(rect.width, rect.height);
					bubble.attr({
						fill: color,
						rx: 2,
						ry: 2,
						stroke: '#333',
						'stroke-width': '1px'
					});
					bubble.move(rect.x, rect.y);

					if (s && s != '') {
						var text = new SVG.Text();
						text.attr({
							x:0, y:0,
							'text-anchor': 'middle'
						});
						var maxChars = Math.ceil(rect.width / 7.7);
						var wrappedText = this.wordwrap(s, maxChars, '\n', true).trim();
						text.text(wrappedText);
						text.leading(1);

						this.put(text);						

						// figure out horizontal and vertical alignment
						var lineheight = text.leading() * new SVG.Number(text.attr('font-size'));
						var numLines = ((wrappedText.match(/\n/g) || []).length + 1);
						var textHeight = numLines * lineheight;
						var offsetY = (rect.height - textHeight) / 2;
						text.move(rect.x + rect.width / 2, rect.y + offsetY);

						// expose text element
                    	bubble.text = text;



					};

					return bubble;
				}

			}
		});

		return SVG;
	}
);