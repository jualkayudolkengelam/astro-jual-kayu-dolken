<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:html="http://www.w3.org/TR/REC-html40"
	xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
	xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml">
		<head>
			<title>XML Sitemap — Jual Kayu Dolken Gelam</title>
			<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
			<style type="text/css">
				body {
					font-family: -apple-system, Helvetica, Arial, sans-serif;
					font-size: 14px;
					color: #334155;
					background: #f8fafc;
					margin: 0;
					padding: 2rem 1rem;
				}
				#content {
					margin: 0 auto;
					max-width: 960px;
					background: #fff;
					border-radius: 12px;
					box-shadow: 0 2px 12px rgba(0,0,0,.08);
					padding: 1.5rem 2rem;
				}
				h1 {
					font-size: 1.25rem;
					color: #1a5fb4;
					border-bottom: 3px solid #dcb46a;
					padding-bottom: .4rem;
					margin: 0 0 .5rem;
				}
				.expl {
					margin: .5rem 0 1.25rem;
					line-height: 1.4;
					color: #64748b;
					font-size: .85rem;
				}
				table {
					width: 100%;
					border: none;
					border-collapse: collapse;
				}
				th {
					text-align: left;
					font-size: .8rem;
					text-transform: uppercase;
					letter-spacing: .05em;
					color: #475569;
					border-bottom: 2px solid #e2e8f0;
					padding: .5rem .6rem;
				}
				td {
					padding: .55rem .6rem;
					border-bottom: 1px solid #f1f5f9;
				}
				#sitemap tbody tr:nth-child(odd) td {
					background-color: #f8fafc;
				}
				#sitemap tbody tr:hover td {
					background-color: #fef3c7;
				}
				#sitemap tbody tr:hover td a {
					color: #92400e;
				}
				a {
					color: #b45309;
					text-decoration: none;
					font-weight: 500;
				}
				a:hover { text-decoration: underline; }
				.lastmod {
					color: #94a3b8;
					font-size: .8rem;
					white-space: nowrap;
				}
				.footer {
					margin-top: 1.25rem;
					font-size: .75rem;
					color: #94a3b8;
					text-align: center;
				}
			</style>
		</head>
		<body>
			<div id="content">
				<h1>XML Sitemap</h1>
				<p class="expl">
					Ini adalah sitemap XML untuk <a href="/">Jual Kayu Dolken Gelam</a>.
					Dibuat untuk mesin pencari (Google, Bing). Jumlah URL:
					<xsl:value-of select="count(sitemap:urlset/sitemap:url)" />
					di sitemap ini.
				</p>
				<table id="sitemap" cellpadding="3">
					<thead>
						<tr>
							<th width="70%">URL</th>
							<th>Terakhir diperbarui</th>
						</tr>
					</thead>
					<tbody>
						<xsl:for-each select="sitemap:urlset/sitemap:url">
							<xsl:sort select="sitemap:lastmod" order="descending" data-type="text"/>
							<tr>
								<td>
									<xsl:variable name="loc"><xsl:value-of select="sitemap:loc"/></xsl:variable>
									<a href="{$loc}"><xsl:value-of select="sitemap:loc"/></a>
								</td>
								<td class="lastmod"><xsl:value-of select="sitemap:lastmod"/></td>
							</tr>
						</xsl:for-each>
					</tbody>
				</table>
				<p class="footer">Sitemap XML — Jual Kayu Dolken Gelam</p>
			</div>
		</body>
		</html>
	</xsl:template>
</xsl:stylesheet>